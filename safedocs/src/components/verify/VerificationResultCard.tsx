import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VerificationResult } from "../../types/verify.types"
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Calendar, 
  FileText, 
  Hash,
  Eye,
  Download
} from "lucide-react"

interface VerificationResultCardProps {
  result: VerificationResult
}

export function VerificationResultCard({ result }: VerificationResultCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "modified":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "corrupted":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verificado</Badge>
      case "modified":
        return <Badge className="bg-yellow-100 text-yellow-800">Modificado</Badge>
      case "corrupted":
        return <Badge className="bg-red-100 text-red-800">Corrupto</Badge>
      default:
        return <Badge variant="secondary">Sin verificar</Badge>
    }
  }

  const getIntegrityColor = (integrity: number) => {
    if (integrity >= 95) return "bg-green-500"
    if (integrity >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card key={result.id}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(result.status)}
              <div>
                <h3 className="font-medium">{result.fileName}</h3>
                <p className="text-sm text-muted-foreground">{(result.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(result.status)}
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Integrity Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Integridad</span>
              <span>{result.integrity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getIntegrityColor(result.integrity)}`}
                style={{ width: `${result.integrity}%` }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Subido</p>
                <p className="text-muted-foreground">{result.uploadDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Modificado</p>
                <p className="text-muted-foreground">{result.lastModified.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Hash</p>
                <p className="text-muted-foreground font-mono text-xs">{result.hash.substring(0, 20)}...</p>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Detalles de Verificación</p>
            <div className="space-y-1">
              {result.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      result.status === "verified"
                        ? "bg-green-500"
                        : result.status === "modified"
                          ? "bg-yellow-500"
                          : result.status === "corrupted"
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }`}
                  />
                  <span className="text-muted-foreground">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
