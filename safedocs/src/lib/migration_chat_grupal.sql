-- Migración para permitir chat grupal sin documento específico
-- Ejecutar este script en tu base de datos Supabase

-- 1. Hacer que document_id sea nullable para permitir chat grupal
DO $$
BEGIN
    -- Solo ejecutar si la columna no es nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_shares' 
        AND column_name = 'document_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.document_shares 
        ALTER COLUMN document_id DROP NOT NULL;
        
        RAISE NOTICE 'document_id column made nullable for group chat support';
    ELSE
        RAISE NOTICE 'document_id column is already nullable';
    END IF;
END $$;

-- 2. Agregar un comentario para clarificar el uso
COMMENT ON COLUMN public.document_shares.document_id IS 'UUID del documento compartido. NULL para chat grupal general.';

-- 3. Crear un índice para mejorar las consultas de chats grupales
CREATE INDEX IF NOT EXISTS document_shares_group_chat_idx 
ON public.document_shares(created_by, is_active) 
WHERE document_id IS NULL;

-- 4. Verificar que el trigger de share_token funciona correctamente
-- (ya debería estar funcionando con el esquema existente)

-- 5. Insertar un mensaje de prueba del sistema (opcional)
INSERT INTO public.document_share_messages (share_id, sender_id, content, msg_type)
SELECT 
    id,
    NULL,
    'Sistema de chat grupal configurado correctamente ✅',
    'system'
FROM public.document_shares 
WHERE document_id IS NULL 
AND NOT EXISTS (
    SELECT 1 FROM public.document_share_messages 
    WHERE share_id = document_shares.id 
    AND msg_type = 'system'
    AND content LIKE '%Sistema de chat grupal%'
)
LIMIT 1;

-- Verificación final
SELECT 
    COUNT(*) as total_chats_grupales,
    COUNT(DISTINCT created_by) as usuarios_creadores
FROM public.document_shares 
WHERE document_id IS NULL AND is_active = true;
