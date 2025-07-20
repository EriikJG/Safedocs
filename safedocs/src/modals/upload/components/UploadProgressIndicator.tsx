import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UploadProgressIndicatorProps {
  progress: number
}

export function UploadProgressIndicator({ progress }: UploadProgressIndicatorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subiendo documentos y creando verificaciones...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  )
}
