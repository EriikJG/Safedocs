esquema de la base de datos -- ====================================================================
-- SafeDocs · Esquema básico + Trigger perfiles • PostgreSQL 14
-- ====================================================================
create extension if not exists "pgcrypto";

-----------------------------------------------------------------------
-- 1) Profiles (SettingsPage)
-----------------------------------------------------------------------
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  full_name    text    not null,
  avatar_url   text,
  phone        text,
  company      text,
  bio          text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ⬇  TRIGGER para autollenar profiles
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name  text := coalesce(new.raw_user_meta_data ->> 'full_name',
                                split_part(new.email, '@', 1));
  v_avatar     text := new.raw_user_meta_data ->> 'avatar_url';
begin
  insert into public.profiles (user_id, full_name, avatar_url, created_at, updated_at)
  values (new.id, v_full_name, v_avatar, now(), now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-----------------------------------------------------------------------
-- 2) Documents (UploadPage, DashboardPage, SharePage)
-----------------------------------------------------------------------
create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text,
  doc_type        text,
  tags            text[] default '{}',
  mime_type       text not null,
  file_size       bigint not null,
  file_path       text  not null,
  checksum_sha256 text  not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists documents_owner_idx   on public.documents(owner_id);
create index if not exists documents_created_idx on public.documents(created_at);

-----------------------------------------------------------------------
-- 3) Shares + Chat + Views (SharePage)
-----------------------------------------------------------------------
create table if not exists public.document_shares (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid references public.documents(id) on delete cascade, -- Nullable para chat grupal
  created_by   uuid not null references auth.users(id) on delete cascade,
  share_token  text not null unique,
  title        text,
  message      text,
  expires_at   timestamptz,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

create table if not exists public.document_share_participants (
  id       bigserial primary key,
  share_id uuid not null references public.document_shares(id) on delete cascade,
  user_id  uuid references auth.users(id),
  email    text,
  added_at timestamptz default now(),
  constraint chk_user_or_email check (user_id is not null or email is not null)
);

create type message_type as enum ('text','document','system');

create table if not exists public.document_share_messages (
  id            bigserial primary key,
  share_id      uuid not null references public.document_shares(id) on delete cascade,
  sender_id     uuid references auth.users(id),
  content       text not null,
  msg_type      message_type default 'text',
  attached_file text,
  created_at    timestamptz default now()
);

create table if not exists public.document_share_views (
  id           bigserial primary key,
  share_id     uuid not null references public.document_shares(id) on delete cascade,
  viewer_id    uuid references auth.users(id),
  viewer_email text,
  ip_address   inet,
  user_agent   text,
  viewed_at    timestamptz default now()
);

-----------------------------------------------------------------------
-- 4) Verificaciones (VerifyPage)
-----------------------------------------------------------------------
create type verification_status as enum ('verified','modified','corrupted','unknown');

create table if not exists public.document_verifications (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references public.documents(id) on delete cascade,
  run_by        uuid references auth.users(id),
  status        verification_status not null,
  integrity_pct numeric(5,2) not null,
  hash_checked  text not null,
  details       jsonb,
  created_at    timestamptz default now()
);

-----------------------------------------------------------------------
-- 5) Historial (HistoryPage)
-----------------------------------------------------------------------
create type history_action as enum ('upload','download','share','verify','view','delete');

create table if not exists public.history (
  id           bigserial primary key,
  user_id      uuid references auth.users(id),
  action       history_action not null,
  document_id  uuid references public.documents(id),
  details      text,
  ip_address   inet,
  user_agent   text,
  created_at   timestamptz default now()
);

-- Índices adicionales
create index if not exists history_user_idx on public.history(user_id);
create index if not exists history_doc_idx  on public.history(document_id);

-----------------------------------------------------------------------
-- 6) Helper: genera share_token si está vacío
-----------------------------------------------------------------------
create or replace function public.generate_share_token()
returns text language sql
as $$ select encode(gen_random_bytes(12), 'hex') $$;

create or replace function public.document_shares_set_token()
returns trigger language plpgsql as $$
begin
  if new.share_token is null then
    new.share_token := public.generate_share_token();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_share_token on public.document_shares;

create trigger trg_set_share_token
  before insert on public.document_shares
  for each row execute function public.document_shares_set_token();

/* ───────────────────────────────────────────────────────────────────
   FIN  ·  Todo listo para probar sin RLS.
   Cuando funcione, habilita RLS y crea políticas según tu modelo.
   ─────────────────────────────────────────────────────────────────── */