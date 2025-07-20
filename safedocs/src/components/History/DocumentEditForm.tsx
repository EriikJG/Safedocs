"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit, Save, X, Tag, Plus } from "lucide-react"

interface EditingDocument {
  title: string
  description: string
  doc_type: string
  tags: string[]
}

interface DocumentEditFormProps {
  editingData: EditingDocument
  setEditingData: (data: EditingDocument) => void
  onSave: () => void
  onCancel: () => void
  documentTypes: string[]
}

export function DocumentEditForm({
  editingData,
  setEditingData,
  onSave,
  onCancel,
  documentTypes,
}: DocumentEditFormProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !editingData.tags.includes(newTag.trim())) {
      setEditingData({
        ...editingData,
        tags: [...editingData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditingData({
      ...editingData,
      tags: editingData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Edit className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-blue-600">Editando documento</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            value={editingData.title}
            onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
            placeholder="Título del documento"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de documento</label>
          <Select
            value={editingData.doc_type}
            onValueChange={(value) => setEditingData({ ...editingData, doc_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea
          value={editingData.description}
          onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
          placeholder="Descripción del documento..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Etiquetas</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {editingData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nueva etiqueta..."
            onKeyPress={(e) => e.key === "Enter" && addTag()}
          />
          <Button onClick={addTag} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  )
}
