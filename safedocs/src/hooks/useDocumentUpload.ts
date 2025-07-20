import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { documentService } from "@/services"
import { UploadMetadata } from "../types/Documents.types"
import { API_CONFIG } from "@/config/api"

export function useDocumentUpload() {
  const { user } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [metadata, setMetadata] = useState<UploadMetadata>({
    docType: undefined,
    title: "",
    description: "",
    tags: ""
  })

  const resetForm = () => {
    setFiles([])
    setMetadata({
      docType: undefined,
      title: "",
      description: "",
      tags: ""
    })
    setUploadProgress(0)
  }

  const handleUpload = async (): Promise<boolean> => {
    if (!metadata.docType) {
      alert("Por favor, selecciona el tipo de documento")
      return false
    }
    if (!metadata.title.trim()) {
      alert("Por favor, ingresa el título del documento")
      return false
    }
    if (files.length === 0) {
      alert("Por favor, selecciona al menos un archivo para subir")
      return false
    }

    setUploading(true)
    setUploadProgress(0)
    let success = true

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Crear FormData para enviar el archivo al backend
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', files.length > 1 ? `${metadata.title} - ${file.name}` : metadata.title)
        formData.append('description', metadata.description || '')
        formData.append('doc_type', metadata.docType!)
        
        if (metadata.tags) {
          const tags = metadata.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
          
          // Enviar cada tag individualmente para que el backend lo reciba como array
          tags.forEach(tag => {
            formData.append('tags[]', tag)
          })
        }

        // Subir archivo y crear documento a través del backend con cookies HttpOnly
        const response = await fetch(`${API_CONFIG.backend.baseUrl}${API_CONFIG.backend.endpoints.documents}/upload`, {
          method: 'POST',
          credentials: 'include', // 🔑 CLAVE: Envía cookies HttpOnly automáticamente
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
        }

        const documentData = await response.json()

        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      } catch (error: unknown) {
        let errorMessage = "Error desconocido"
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === "string") {
          errorMessage = error
        }
        alert(`Error al subir ${file.name}: ${errorMessage}`)
        console.error('Error en upload:', error)
        success = false
      }
    }

    setUploading(false)
    if (success) {
      alert("Todos los archivos fueron subidos correctamente")
      resetForm()
    }
    return success
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMetadata = (field: keyof UploadMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }))
  }

  return {
    files,
    metadata,
    uploading,
    uploadProgress,
    handleFileSelect,
    removeFile,
    updateMetadata,
    handleUpload,
    resetForm
  }
}
