import { Download, Mail, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DataManagementSettings() {
  return (
<>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Exportar Todos los Documentos
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Descargar Historial de Actividad
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="mr-2 h-4 w-4" />
            Solicitar Copia de Datos Personales
          </Button>
        </div>

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Todos los datos exportados están encriptados y requieren tu contraseña para acceder.
          </AlertDescription>
        </Alert>
</>
  )
}
