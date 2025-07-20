"use client"

import { useAuth } from "@/contexts/AuthContext"
import { DashboardTitle } from "@/components/Sliderbar/DashboardTitle"
import { useOverviewStats } from "../../../hooks/useOverviewStats"
import { StatsCards } from "../../../components/overview/StatsCards"
import { StorageUsageCard } from "../../../components/overview/StorageUsageCard"
import { QuickActionsCard } from "../../../components/overview/QuickActionsCard"
import { RecentActivityCard } from "../../../components/overview/RecentActivityCard"
import Loading from "@/components/ui/Loading"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, isLoading } = useOverviewStats(user)

  // El AuthGuard del layout se encarga de la protección de rutas
  // Aquí solo manejamos el loading de los datos
  if (isLoading) {
    return <Loading title="Cargando dashboard..." showDashboardTitle={true} />
  }

  return (
    <>
      <DashboardTitle>Overview</DashboardTitle>

      <div className="flex-1 space-y-6 p-6">
        <StatsCards 
          documentCount={stats.documentCount}
          sharedCount={stats.sharedCount}
          verifiedCount={stats.verifiedCount}
          authorizedUsers={stats.authorizedUsers}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <StorageUsageCard />
          <QuickActionsCard />
        </div>

        <RecentActivityCard />
      </div>
    </>
  )
}
