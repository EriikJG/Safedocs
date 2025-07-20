import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  action: string
  document: string
  time: string
  status: 'success' | 'info' | 'warning'
}

export function RecentActivityCard() {
  const recentActivity: Activity[] = [
    {
      action: "Documento verificado",
      document: "Cédula de Identidad",
      time: "Hace 2 horas",
      status: "success",
    },
    {
      action: "Documento compartido",
      document: "Título de Propiedad",
      time: "Hace 4 horas",
      status: "info",
    },
    {
      action: "Nuevo documento subido",
      document: "Pasaporte",
      time: "Hace 1 día",
      status: "success",
    },
    {
      action: "Acceso autorizado",
      document: "Escritura Notarial",
      time: "Hace 2 días",
      status: "warning",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.status === "success"
                    ? "bg-green-500"
                    : activity.status === "info"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                }`}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.document}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
