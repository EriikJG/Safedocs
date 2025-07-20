import React from 'react'
import { DashboardTitle } from '../Sliderbar/DashboardTitle'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  title: string;
  showDashboardTitle?: boolean;
}

export default function Loading({ title, showDashboardTitle = true }: LoadingProps) {
  return (
    <>
      {showDashboardTitle && <DashboardTitle>{title}</DashboardTitle>}
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)] w-full ">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    </>
  )
}

// Componente específico para loading simple sin sidebar
export function SimpleLoading({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg font-medium">{title}</p>
      </div>
    </div>
  )
}
