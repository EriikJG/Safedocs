import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileText, ImageIcon, File, X } from "lucide-react"

interface SelectedFilesListProps {
  files: File[]
  onRemoveFile: (index: number) => void
}

export function SelectedFilesList({ files, onRemoveFile }: SelectedFilesListProps) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type === "application/pdf") return FileText
    return File
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-2">
      <Label>Archivos Seleccionados ({files.length})</Label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file)
          return (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemoveFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
