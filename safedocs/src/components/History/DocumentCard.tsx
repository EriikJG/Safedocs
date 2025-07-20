"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { File, Calendar, Tag, Edit, Trash2, Share2, Users } from "lucide-react"
import { DocumentEditForm } from "./DocumentEditForm"

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

interface EditingDocument {
  title: string
  description: string
  doc_type: string
  tags: string[]
}

interface DocumentCardProps {
  document: Document
  isExpanded: boolean
  isEditing: boolean
  editingData: EditingDocument
  documentTypes: string[]
  onToggleExpand: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onShare: () => void
  onManageShares?: () => void
  onVerify?: () => void
  setEditingData: (data: EditingDocument) => void
  formatFileSize: (bytes: number) => string
  getMimeTypeIcon: (mimeType: string) => string
}

export function DocumentCard({
  document,
  isExpanded,
  isEditing,
  editingData,
  documentTypes,
  onToggleExpand,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onShare,
  onManageShares,
  onVerify,
  setEditingData,
  formatFileSize,
  getMimeTypeIcon,
}: DocumentCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Compact Header - Always Visible */}
      <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl">{getMimeTypeIcon(document.mime_type)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{document.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <File className="h-3 w-3" />
                  {formatFileSize(document.file_size)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(document.created_at).toLocaleDateString()}
                </span>
                {document.doc_type && (
                  <Badge variant="outline" className="text-xs">
                    {document.doc_type}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {document.tags && document.tags.length > 0 && (
              <span className="text-xs text-gray-500">
                {document.tags.length} etiqueta{document.tags.length !== 1 ? "s" : ""}
              </span>
            )}
            <div className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Expanded Content - Conditionally Visible */}
      {isExpanded && (
        <div className="border-t bg-gray-50">
          <CardContent className="p-6">
            {isEditing ? (
              <DocumentEditForm
                editingData={editingData}
                setEditingData={setEditingData}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                documentTypes={documentTypes}
              />
            ) : (
              <div className="space-y-6">
                {/* Información del documento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Tipo de documento</h4>
                    <p className="text-gray-600">
                      {document.doc_type ? (
                        <Badge variant="outline">{document.doc_type}</Badge>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Formato</h4>
                    <p className="text-gray-600">
                      <Badge variant="secondary">{document.mime_type}</Badge>
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                {document.description && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                    <p className="text-gray-600">{document.description}</p>
                  </div>
                )}

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 mb-2">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 bg-white p-4 rounded-lg border">
                  <div>
                    <span className="font-medium">Creado:</span>
                    <br />
                    {new Date(document.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Actualizado:</span>
                    <br />
                    {new Date(document.updated_at).toLocaleString()}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={onStartEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={onShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  {onManageShares && (
                    <Button size="sm" variant="outline" onClick={onManageShares}>
                      <Users className="h-4 w-4 mr-2" />
                      Gestionar
                    </Button>
                  )}
                  {onVerify && (
                    <Button size="sm" variant="outline" onClick={onVerify}>
                      <File className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      )}
    </Card>
  )
}
