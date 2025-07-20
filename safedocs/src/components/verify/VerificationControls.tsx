import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Scan, Shield } from "lucide-react"

interface VerificationControlsProps {
  lastVerification: Date | null
  verifying: boolean
  verificationProgress: number
  resultsCount: number
  formatTimeAgo: (date: Date) => string
  onVerify: () => void
}

export function VerificationControls({
  lastVerification,
  verifying,
  verificationProgress,
  resultsCount,
  formatTimeAgo,
  onVerify
}: VerificationControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Verificación de Integridad
        </CardTitle>
        <CardDescription>Ejecuta una verificación completa de todos tus documentos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Última verificación</p>
            <p className="text-sm text-muted-foreground">
              {lastVerification ? formatTimeAgo(lastVerification) : 'Nunca'}
            </p>
          </div>
          <Button 
            onClick={onVerify} 
            disabled={verifying || resultsCount === 0} 
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            {verifying ? "Verificando..." : "Iniciar Verificación"}
          </Button>
        </div>

        {verifying && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verificando documentos...</span>
              <span>{verificationProgress}%</span>
            </div>
            <Progress value={verificationProgress} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
