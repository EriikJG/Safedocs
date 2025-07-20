import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function EmptyDocumentsCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium">No hay documentos para verificar</h3>
            <p className="text-sm text-muted-foreground">Sube algunos documentos para comenzar la verificación</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
