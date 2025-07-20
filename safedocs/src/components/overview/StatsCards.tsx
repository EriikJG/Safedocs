import { FileText, Share2, Shield, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  documentCount: number
  sharedCount: number
  verifiedCount: number
  authorizedUsers: number
}

export function StatsCards({ documentCount, sharedCount, verifiedCount, authorizedUsers }: StatsCardsProps) {
  const stats = [
    {
      title: "Documentos Subidos",
      value: documentCount.toString(),
      description: "Total de documentos",
      icon: FileText,
      trend: "+12% desde el mes pasado",
    },
    {
      title: "Documentos Compartidos",
      value: sharedCount.toString(),
      description: "Enlaces activos",
      icon: Share2,
      trend: "+3 esta semana",
    },
    {
      title: "Verificaciones",
      value: verifiedCount.toString(),
      description: "Documentos verificados",
      icon: Shield,
      trend: "+23% este mes",
    },
    {
      title: "Usuarios Autorizados",
      value: authorizedUsers.toString(),
      description: "Acceso concedido",
      icon: Users,
      trend: "+2 nuevos",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
