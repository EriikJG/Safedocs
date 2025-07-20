import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { documentService } from '@/services'
import { Document } from '@/services/types'

// Definir HistoryEntry localmente ya que se simula
export interface HistoryEntry {
  id: string
  action: 'upload' | 'edit' | 'delete' | 'share' | 'verify'
  document_id: string
  details: string
  created_at: string
  user_id: string
}

export interface UseHistoryDataReturn {
  documents: Document[]
  historyEntries: HistoryEntry[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  handleDeleteDocument: (documentId: string, documentTitle: string) => Promise<void>
  handleUpdateDocument: (documentId: string, updateData: {
    title?: string
    description?: string
    doc_type?: string
    tags?: string[]
  }) => Promise<void>
}

export const useHistoryData = (): UseHistoryDataReturn => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para simular entradas del historial basadas en documentos
  const generateHistoryEntries = (documents: Document[]): HistoryEntry[] => {
    const entries: HistoryEntry[] = []
    
    documents.forEach(doc => {
      // Entrada de creación/upload
      entries.push({
        id: `${doc.id}-upload`,
        action: 'upload',
        document_id: doc.id,
        details: `Documento "${doc.title}" subido exitosamente`,
        created_at: doc.created_at,
        user_id: doc.owner_id
      })
      
      // Si ha sido actualizado, agregar entrada de edición
      if (doc.updated_at && doc.updated_at !== doc.created_at) {
        entries.push({
          id: `${doc.id}-edit`,
          action: 'edit',
          document_id: doc.id,
          details: `Documento "${doc.title}" actualizado`,
          created_at: doc.updated_at,
          user_id: doc.owner_id
        })
      }
      
      // Si está marcado como público, agregar entrada de compartir
      if ((doc as any).is_public) {
        entries.push({
          id: `${doc.id}-share`,
          action: 'share',
          document_id: doc.id,
          details: `Documento "${doc.title}" compartido públicamente`,
          created_at: doc.updated_at || doc.created_at,
          user_id: doc.owner_id
        })
      }
      
      // Si está verificado, agregar entrada de verificación
      if ((doc as any).verification_status === 'verified') {
        entries.push({
          id: `${doc.id}-verify`,
          action: 'verify',
          document_id: doc.id,
          details: `Documento "${doc.title}" verificado exitosamente`,
          created_at: doc.updated_at || doc.created_at,
          user_id: doc.owner_id
        })
      }
    })
    
    return entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const fetchData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)

      // Obtener solo documentos del backend
      const documentsResponse = await documentService.getDocuments()
      
      if (documentsResponse.success) {
        const documents = documentsResponse.data.documents
        setDocuments(documents)
        
        // Generar historial simulado basado en documentos
        const simulatedHistory = generateHistoryEntries(documents)
        setHistoryEntries(simulatedHistory)
      } else {
        setError(documentsResponse.error || 'Error al obtener documentos')
        setDocuments([])
        setHistoryEntries([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error("Error fetching data:", err)
      setDocuments([])
      setHistoryEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string, documentTitle: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el documento "${documentTitle}"?`)) {
      return
    }

    if (!user?.id) {
      throw new Error("Usuario no autenticado")
    }

    try {
      const result = await documentService.deleteDocument(documentId)
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar documento')
      }

      // Refrescar datos
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      throw new Error(`Error al eliminar el documento: ${errorMessage}`)
    }
  }

  const handleUpdateDocument = async (
    documentId: string, 
    updateData: {
      title?: string
      description?: string
      doc_type?: string
      tags?: string[]
    }
  ) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado")
    }

    try {
      const result = await documentService.updateDocument(documentId, updateData)
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar documento')
      }

      // Refrescar datos
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      throw new Error(`Error al actualizar el documento: ${errorMessage}`)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  return {
    documents,
    historyEntries,
    loading,
    error,
    refetch: fetchData,
    handleDeleteDocument,
    handleUpdateDocument,
  }
}
