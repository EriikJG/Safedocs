import { Badge } from "@/components/ui/badge"
import { VerificationResult } from "../../types/verify.types"

interface VerificationResultsSummaryProps {
  results: VerificationResult[]
}

export function VerificationResultsSummary({ results }: VerificationResultsSummaryProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Resultados de Verificación</h2>
      <div className="flex gap-2">
        <Badge variant="outline" className="text-green-600">
          {results.filter((r) => r.status === "verified").length} Verificados
        </Badge>
        <Badge variant="outline" className="text-yellow-600">
          {results.filter((r) => r.status === "modified").length} Modificados
        </Badge>
        <Badge variant="outline" className="text-red-600">
          {results.filter((r) => r.status === "corrupted").length} Corruptos
        </Badge>
        <Badge variant="outline" className="text-gray-600">
          {results.filter((r) => r.status === "unknown").length} Sin verificar
        </Badge>
      </div>
    </div>
  )
}
