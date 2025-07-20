import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export function SecurityNotice() {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertDescription>
        La verificación utiliza algoritmos criptográficos avanzados para detectar cualquier modificación no
        autorizada en tus documentos. Los resultados se actualizan automáticamente.
      </AlertDescription>
    </Alert>
  )
}
