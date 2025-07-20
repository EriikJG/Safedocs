import { Card, CardContent } from "@/components/ui/card"
import { History, Upload, Share2, Shield } from "lucide-react"

interface StatsCardsProps {
  totalActivities: number
  totalDocuments: number
  sharedDocuments: number
  verifications: number
}

export function StatsCards({ totalActivities, totalDocuments, sharedDocuments, verifications }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Actividades</p>
              <p className="text-2xl font-bold">{totalActivities}</p>
            </div>
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documentos Subidos</p>
              <p className="text-2xl font-bold">{totalDocuments}</p>
            </div>
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documentos Compartidos</p>
              <p className="text-2xl font-bold">{sharedDocuments}</p>
            </div>
            <Share2 className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verificaciones</p>
              <p className="text-2xl font-bold">{verifications}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
