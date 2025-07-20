"use client"

import * as React from "react"
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
  User,
  Shield,
  Sliders,
  Database,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSettingsState } from "@/hooks/useSettingsState"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { SecuritySettings } from "@/components/settings/SecuritySettings"
import { PreferencesSettings } from "@/components/settings/PreferencesSettings"
import { DataManagementSettings } from "@/components/settings/DataManagementSettings"
import { DangerZoneSettings } from "@/components/settings/DangerZoneSettings"
import { useState } from "react"

const settingsNav = [
  { name: "Perfil", icon: User, component: "profile" },
  { name: "Seguridad", icon: Shield, component: "security" },
  { name: "Preferencias", icon: Sliders, component: "preferences" },
  { name: "Gestión de datos", icon: Database, component: "data" },
  { name: "Zona de peligro", icon: AlertTriangle, component: "danger" },
]

export function SettingsDialog({
  open = false,
  onOpenChange = () => {},
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [activeSection, setActiveSection] = useState("profile")
  const {
    profile,
    security,
    preferences,
    handleProfileChange,
    handleSecurityChange,
    handlePreferencesChange,
  } = useSettingsState()

  const handleSaveChanges = () => {
    // Implementar la lógica para guardar los cambios
    console.log("Guardando cambios", { profile, security, preferences })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[700px] md:max-w-[800px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">Configuración</DialogTitle>
        <DialogDescription className="sr-only">
          Personaliza tu configuración aquí.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeSection === item.component}
                          onClick={() => setActiveSection(item.component)}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[550px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center border-b px-6">
              <h2 className="text-lg font-semibold">
                {settingsNav.find(
                  (item) => item.component === activeSection
                )?.name || "Configuración"}
              </h2>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              {activeSection === "profile" && (
                <ProfileSettings
                  profile={profile}
                  onProfileChange={handleProfileChange}
                />
              )}

              {activeSection === "security" && (
                <SecuritySettings
                  security={security}
                  onSecurityChange={handleSecurityChange}
                />
              )}

              {activeSection === "preferences" && (
                <PreferencesSettings
                  preferences={preferences}
                  onPreferencesChange={handlePreferencesChange}
                />
              )}

              {activeSection === "data" && <DataManagementSettings />}

              {activeSection === "danger" && <DangerZoneSettings />}

              {/* Save Button - only shown when not in data or danger sections */}
              {activeSection !== "data" && activeSection !== "danger" && (
                <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
