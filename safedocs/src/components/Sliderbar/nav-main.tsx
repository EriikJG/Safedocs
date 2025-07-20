'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';              // util para concatenar clases

interface NavItem {
  title: string;
  url: string;          // ejemplo: "/share"
  icon?: LucideIcon;
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();             // ruta actual, ej. "/share/abc123"

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          /* Se considera activo si:
             - la ruta actual es exactamente item.url   → "/share"
             - o empieza con item.url + "/"            → "/share/abc123" */
          const active =
            pathname === item.url || pathname.startsWith(`${item.url}/`);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                /* marca activo con estilos o data-attribute */
                className={cn(
                  'flex items-center gap-2',
                  active && 'bg-muted/50 font-medium'
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
