import { BoxIcon, Share2, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function QuickActionsCard() {
  const router = useRouter()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Tareas frecuentes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => router.push("/history")}
        >
          <BoxIcon className="mr-2 h-4 w-4" />
          Mi Almacen
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => router.push("/share")}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartir Documento
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => router.push("/verify")}
        >
          <Shield className="mr-2 h-4 w-4" />
          Verificar Integridad
        </Button>
      </CardContent>
    </Card>
  )
}
