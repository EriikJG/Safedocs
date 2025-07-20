"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  CheckSquare,
  CloudUpload,
  Link2,
  ShieldCheck,
  Settings2,
  Crown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const teams = [
  {
    name: "Safedocs Inc",
    logo: ShieldCheck,
    plan: "Enterprise",
  },
];

const navMain = [
  {
    title: "Dashboard",
    url: "/overview",
    icon: AudioWaveform,
    isActive: true,
  },
  {
    title: "Mi Almacen",
    url: "/history",
    icon: BookOpen,
  },
  {
    title: "Compartir Documentos",
    url: "/share",
    icon: Link2,
  },
  {
    title: "Verificar Documentos",
    url: "/verify",
    icon: CheckSquare,
  },
];

// Pestaña de admin solo para usuarios administradores
const adminNavItem = {
  title: "Administración",
  url: "/admin",
  icon: Crown,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Get user display name from metadata or email
  const userName = user?.name || 
                   user?.email?.split('@')[0] || 
                   "Usuario Safedocs";
  
  // Create user data object with actual user information
  const userData = {
    name: userName,
    email: user?.email || "usuario@safedocs.com",
    avatar: "/avatars/default-avatar.png",
  };

  // Crear navegación dinámica basada en el rol del usuario
  const navigationItems = React.useMemo(() => {
    const items = [...navMain];
    
    // Agregar pestaña de admin solo si el usuario es administrador
    if (user?.role === 'admin') {
      items.push(adminNavItem);
    }
    
    return items;
  }, [user?.role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
