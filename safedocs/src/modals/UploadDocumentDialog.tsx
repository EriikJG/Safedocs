"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDocumentUpload } from "../hooks/useDocumentUpload"
import { FileUploadArea } from "./upload/components/FileUploadArea"
import { SelectedFilesList } from "./upload/components/SelectedFilesList"
import { DocumentMetadataForm } from "./upload/components/DocumentMetadataForm"
import { UploadProgressIndicator } from "./upload/components/UploadProgressIndicator"
import { SecurityNotice } from "./upload/components/SecurityNotice"
import { UploadDocumentDialogProps } from "../types/Documents.types"

export function UploadDocumentDialog({ trigger, onUploadComplete }: UploadDocumentDialogProps = {}) {
  const [open, setOpen] = useState(false)
  
  const {
    files,
    metadata,
    uploading,
    uploadProgress,
    handleFileSelect,
    removeFile,
    updateMetadata,
    handleUpload,
    resetForm
  } = useDocumentUpload()

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) resetForm()
  }

  const onUploadClick = async () => {
    const success = await handleUpload()
    if (success) {
      setOpen(false)
      // Refrescar los datos en el componente padre
      onUploadComplete?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Subir Documento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subir Documentos</DialogTitle>
          <DialogDescription>
            Sube documentos a tu almacenamiento seguro. Todos los archivos son encriptados automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Upload Area */}
          <div className="space-y-4">
            <FileUploadArea onFileSelect={handleFileSelect} />
            <SelectedFilesList files={files} onRemoveFile={removeFile} />
          </div>

          {/* Document Information */}
          <DocumentMetadataForm metadata={metadata} onUpdateMetadata={updateMetadata} />
        </div>

        {/* Security Notice */}
        <SecurityNotice />

        {/* Upload Progress */}
        {uploading && <UploadProgressIndicator progress={uploadProgress} />}

        {/* Upload Button */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" disabled={uploading} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onUploadClick} disabled={files.length === 0 || uploading}>
            {uploading ? (
              <>Subiendo...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Documentos
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
