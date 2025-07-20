import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import { ActivityCard } from "./ActivityCard"

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

interface ActivityHistoryProps {
  entries: HistoryEntry[]
  documents: Document[]
  totalEntries: number
}

export function ActivityHistory({ entries, documents, totalEntries }: ActivityHistoryProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">Registro de Actividades</CardTitle>
          <CardDescription>
            {entries.length} de {totalEntries} actividades
          </CardDescription>
        </div>
        <History className="h-4 w-4" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {entries.map((entry) => {
            const document = documents.find((doc) => doc.id === entry.document_id)
            return <ActivityCard key={entry.id} entry={entry} document={document} />
          })}

          {entries.length === 0 && (
            <div className="text-center py-16">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No se encontraron actividades</h3>
              <p className="mt-2 text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
