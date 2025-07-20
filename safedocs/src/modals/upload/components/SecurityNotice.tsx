import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SecurityNotice() {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Todos los documentos son encriptados automáticamente antes del almacenamiento. Se crea una verificación inicial para garantizar la integridad.
      </AlertDescription>
    </Alert>
  )
}
