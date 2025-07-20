import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Share2, Shield, Eye, Trash2, FileText } from "lucide-react"

interface HistoryEntry {
  id: number
  action: "upload" | "download" | "share" | "verify" | "view" | "delete"
  document_id: string | null
  user_id: string | null
  details: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

interface Document {
  id: string
  title: string
  description: string | null
  doc_type: string | null
  tags: string[]
  mime_type: string
  file_size: number
  created_at: string
  updated_at: string
}

interface ActivityCardProps {
  entry: HistoryEntry
  document: Document | undefined
}

export function ActivityCard({ entry, document }: ActivityCardProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <Upload className="h-4 w-4 text-blue-500" />
      case "download":
        return <Download className="h-4 w-4 text-green-500" />
      case "share":
        return <Share2 className="h-4 w-4 text-purple-500" />
      case "verify":
        return <Shield className="h-4 w-4 text-orange-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: string) => {
    const variants = {
      upload: "bg-blue-100 text-blue-800",
      download: "bg-green-100 text-green-800",
      share: "bg-purple-100 text-purple-800",
      verify: "bg-orange-100 text-orange-800",
      view: "bg-gray-100 text-gray-800",
      delete: "bg-red-100 text-red-800",
    }

    const labels = {
      upload: "Subida",
      download: "Descarga",
      share: "Compartido",
      verify: "Verificación",
      view: "Visualización",
      delete: "Eliminación",
    }

    return <Badge className={variants[action as keyof typeof variants]}>{labels[action as keyof typeof labels]}</Badge>
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div>{getActionIcon(entry.action)}</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium leading-none">{document?.title || "Documento eliminado"}</h4>
            <p className="text-sm text-muted-foreground mt-1">{entry.details || "Sin detalles adicionales"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
            {getActionBadge(entry.action)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
