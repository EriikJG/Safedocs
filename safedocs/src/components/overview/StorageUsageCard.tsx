import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StorageUsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de Almacenamiento</CardTitle>
        <CardDescription>Espacio utilizado en tu cuenta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Documentos</span>
            <span>2.4 GB / 10 GB</span>
          </div>
          <Progress value={24} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground">Tienes 7.6 GB disponibles</div>
      </CardContent>
    </Card>
  )
}
