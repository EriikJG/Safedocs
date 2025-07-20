import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadMetadata } from "../../../types/Documents.types"

interface DocumentMetadataFormProps {
  metadata: UploadMetadata
  onUpdateMetadata: (field: keyof UploadMetadata, value: string) => void
}

export function DocumentMetadataForm({ metadata, onUpdateMetadata }: DocumentMetadataFormProps) {
  const documentTypes = [
    "Cédula de Identidad",
    "Pasaporte",
    "Título de Propiedad",
    "Escritura Notarial",
    "Contrato",
    "Certificado",
    "Otro",
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-type">Tipo de Documento</Label>
        <Select 
          onValueChange={(val) => onUpdateMetadata("docType", val)} 
          value={metadata.docType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-title">Título del Documento</Label>
        <Input
          id="document-title"
          placeholder="Ej: Cédula de Identidad - Juan Pérez"
          value={metadata.title}
          onChange={(e) => onUpdateMetadata("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-description">Descripción (Opcional)</Label>
        <Textarea
          id="document-description"
          placeholder="Descripción adicional del documento..."
          rows={3}
          value={metadata.description}
          onChange={(e) => onUpdateMetadata("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Etiquetas (Opcional)</Label>
        <Input
          id="tags"
          placeholder="personal, importante, legal"
          value={metadata.tags}
          onChange={(e) => onUpdateMetadata("tags", e.target.value)}
        />
      </div>
    </div>
  )
}
