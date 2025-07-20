import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

interface FileUploadAreaProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function FileUploadArea({ onFileSelect }: FileUploadAreaProps) {
  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <div className="space-y-2">
        <p className="text-sm font-medium">Selecciona archivos para subir</p>
        <p className="text-xs text-muted-foreground">PDF, JPG, PNG hasta 10MB cada uno</p>
      </div>
      <Input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onFileSelect}
        className="mt-4"
      />
    </div>
  )
}
