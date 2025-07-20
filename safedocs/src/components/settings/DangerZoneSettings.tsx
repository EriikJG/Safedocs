import { Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DangerZoneSettings() {
  return (
<>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Todos los Documentos
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Cerrar Cuenta Permanentemente
          </Button>
        </div>

        <Alert className="border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            Estas acciones no se pueden deshacer. Todos tus documentos y datos se eliminarán permanentemente.
          </AlertDescription>
        </Alert>
</>
  )
}
