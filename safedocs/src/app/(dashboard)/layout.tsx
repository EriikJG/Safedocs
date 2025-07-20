import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sliderbar/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ProtectedDashboard } from "@/components/ProtectedDashboard"
import { DocumentShareProvider } from "@/contexts/DocumentShareContext"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedDashboard>
      <DocumentShareProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </DocumentShareProvider>
    </ProtectedDashboard>
  )
}