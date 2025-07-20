// 📄 Servicio de documentos - Integración completa con backend NestJS
import { API_CONFIG, buildApiUrl } from '@/config/api'
import { apiClient } from '@/lib/api-client'
import { Document, CreateDocumentData, UpdateDocumentData } from './types'

export interface UploadDocumentData {
  title: string
  file: File
  isPublic?: boolean
  tags?: string[]
}

export interface DocumentFilters {
  type?: string
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  isPublic?: boolean
  verificationStatus?: string
}

export interface DocumentsResponse {
  success: boolean
  data: {
    documents: Document[]
    total: number
    page: number
    limit: number
  }
  error?: string
}

export interface DocumentResponse {
  success: boolean
  data: Document
  error?: string
}

export interface DocumentUploadResponse {
  success: boolean
  data: {
    document: Document
    uploadUrl?: string
  }
  error?: string
}

export interface VerifyDocumentResponse {
  success: boolean
  data: {
    documentId: string;
    isValid: boolean;
    message: string;
  }
  error?: string
}

export interface IDocumentService {
  getDocuments(filters?: DocumentFilters, page?: number, limit?: number): Promise<DocumentsResponse>
  getDocument(id: string): Promise<DocumentResponse>
  uploadDocument(data: UploadDocumentData): Promise<DocumentUploadResponse>
  updateDocument(id: string, data: Partial<Document>): Promise<DocumentResponse>
  deleteDocument(id: string): Promise<{ success: boolean; error?: string }>
  downloadDocument(id: string): Promise<Blob>
  shareDocument(id: string, isPublic: boolean): Promise<DocumentResponse>
  searchDocuments(query: string, filters?: DocumentFilters): Promise<DocumentsResponse>
  verifyDocument(id: string): Promise<VerifyDocumentResponse>
}

class DocumentService implements IDocumentService {
  private readonly baseEndpoint = API_CONFIG.backend.endpoints.documents // Solo el endpoint relativo

  /**
   * 📋 Obtener lista de documentos con filtros y paginación
   */
  async getDocuments(filters?: DocumentFilters, page = 1, limit = 10): Promise<DocumentsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (filters) {
        if (filters.type) params.append('type', filters.type)
        if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString())
        if (filters.verificationStatus) params.append('verificationStatus', filters.verificationStatus)
        if (filters.tags?.length) params.append('tags', filters.tags.join(','))
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start)
          params.append('endDate', filters.dateRange.end)
        }
      }

      console.log(`🔐 DocumentService - Obteniendo documentos: ${this.baseEndpoint}?${params}`)
      const response = await apiClient.get(`${this.baseEndpoint}?${params}`)
      
      console.log('🔐 DocumentService - Respuesta completa:', response)
      console.log('🔐 DocumentService - response.success:', response.success)
      console.log('🔐 DocumentService - response.data:', response.data)
      console.log('🔐 DocumentService - Array.isArray(response.data):', Array.isArray(response.data))
      
      // El backend NestJS devuelve directamente un array en response.data
      if (response.success && response.data) {
        // Si response.data es un array, usarlo directamente
        if (Array.isArray(response.data)) {
          console.log('✅ DocumentService - Array de documentos recibido:', response.data.length)
          return {
            success: true,
            data: {
              documents: response.data,
              total: response.data.length,
              page,
              limit
            }
          }
        }
        // Si response.data es un objeto con documentos, extraerlos
        else if (response.data.documents && Array.isArray(response.data.documents)) {
          console.log('✅ DocumentService - Documentos en objeto:', response.data.documents.length)
          return {
            success: true,
            data: {
              documents: response.data.documents,
              total: response.data.total || response.data.documents.length,
              page: response.data.page || page,
              limit: response.data.limit || limit
            }
          }
        }
      }
      
      // Si no hay datos o el formato es inesperado
      console.warn('🔐 DocumentService - Formato de respuesta inesperado:', response)
      return {
        success: false,
        data: {
          documents: [],
          total: 0,
          page,
          limit
        },
        error: 'No se encontraron documentos o formato de respuesta inesperado'
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      return {
        success: false,
        data: {
          documents: [],
          total: 0,
          page,
          limit
        },
        error: error.message || 'Error al obtener documentos'
      }
    }
  }

  /**
   * 📄 Obtener documento por ID
   */
  async getDocument(id: string): Promise<DocumentResponse> {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/${id}`)
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        }
      }
      
      return {
        success: false,
        data: null as any,
        error: response.error || 'Error al obtener documento'
      }
    } catch (error: any) {
      console.error('Error fetching document:', error)
      return {
        success: false,
        data: null as any,
        error: error.message || 'Error al obtener documento'
      }
    }
  }

  /**
   * 📤 Subir nuevo documento
   */
  async uploadDocument(data: UploadDocumentData): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('title', data.title)
      
      if (data.tags?.length) {
        formData.append('tags', JSON.stringify(data.tags))
      }

      // Usar método personalizado para FormData
      const response = await this.uploadFormData(`${this.baseEndpoint}/upload`, formData)
      return response
    } catch (error: any) {
      console.error('Error uploading document:', error)
      throw new Error(error.response?.data?.message || 'Error al subir documento')
    }
  }

  /**
   * 📤 Método auxiliar para subir FormData con cookies HttpOnly
   */
  private async uploadFormData(endpoint: string, formData: FormData): Promise<DocumentUploadResponse> {
    console.log('🔐 DocumentService - Subiendo archivo con cookies HttpOnly')
    
    // Construir URL completa
    const fullUrl = `${API_CONFIG.backend.baseUrl}${endpoint}`
    console.log('🔐 DocumentService - URL de upload:', fullUrl)
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include', // 🔑 CLAVE: Envía cookies HttpOnly automáticamente
      // NO incluir Content-Type para FormData, el navegador lo configura automáticamente
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al subir archivo')
    }
    
    return {
      success: true,
      data: {
        document: result,
        uploadUrl: result.file_path
      }
    }
  }

  /**
   * ✏️ Actualizar documento
   */
  async updateDocument(id: string, data: Partial<Document>): Promise<DocumentResponse> {
    try {
      const response = await apiClient.patch(`${this.baseEndpoint}/${id}`, data)
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        }
      }
      
      return {
        success: false,
        data: null as any,
        error: response.error || 'Error al actualizar documento'
      }
    } catch (error: any) {
      console.error('Error updating document:', error)
      return {
        success: false,
        data: null as any,
        error: error.message || 'Error al actualizar documento'
      }
    }
  }

  /**
   * 🗑️ Eliminar documento
   */
  async deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ Eliminando documento: ${id}`)
      const response = await apiClient.delete(`${this.baseEndpoint}/${id}`)
      
      console.log('🗑️ Respuesta de eliminación:', response)
      
      // Manejo más flexible de respuestas exitosas
      if (response.success !== false) {
        console.log('✅ Documento eliminado exitosamente')
        return {
          success: true
        }
      }
      
      console.log('❌ Error al eliminar documento:', response.error)
      return {
        success: false,
        error: response.error || 'Error al eliminar documento'
      }
    } catch (error: any) {
      console.error('💥 Error deleting document:', error)
      return {
        success: false,
        error: error.message || 'Error al eliminar documento'
      }
    }
  }

  /**
   * 📥 Descargar documento con cookies HttpOnly
   */
  async downloadDocument(id: string): Promise<Blob> {
    try {
      console.log('🔐 DocumentService - Descargando documento con cookies HttpOnly')
      
      const response = await fetch(`${API_CONFIG.backend.baseUrl}${this.baseEndpoint}/${id}/download`, {
        method: 'GET',
        credentials: 'include', // 🔑 CLAVE: Envía cookies HttpOnly automáticamente
      })

      if (!response.ok) {
        throw new Error('Error al descargar documento')
      }

      return await response.blob()
    } catch (error: any) {
      console.error('Error downloading document:', error)
      throw new Error(error.response?.data?.message || 'Error al descargar documento')
    }
  }

  /**
   * 🔗 Compartir documento (cambiar visibilidad)
   */
  async shareDocument(id: string, isPublic: boolean): Promise<DocumentResponse> {
    try {
      const response = await apiClient.patch(`${this.baseEndpoint}/${id}/share`, { isPublic })
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        }
      }
      
      return {
        success: false,
        data: null as any,
        error: response.error || 'Error al compartir documento'
      }
    } catch (error: any) {
      console.error('Error sharing document:', error)
      return {
        success: false,
        data: null as any,
        error: error.message || 'Error al compartir documento'
      }
    }
  }

  /**
   * 🔍 Buscar documentos
   */
  async searchDocuments(query: string, filters?: DocumentFilters): Promise<DocumentsResponse> {
    try {
      const params = new URLSearchParams({
        query,
        page: '1',
        limit: '20'
      })

      if (filters) {
        if (filters.type) params.append('type', filters.type)
        if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString())
        if (filters.verificationStatus) params.append('verificationStatus', filters.verificationStatus)
        if (filters.tags?.length) params.append('tags', filters.tags.join(','))
      }

      const response = await apiClient.get(`${this.baseEndpoint}/search?${params}`)
      
      // Manejar la respuesta igual que en getDocuments
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: {
              documents: response.data,
              total: response.data.length,
              page: 1,
              limit: 20
            }
          }
        }
        else if (response.data.documents && Array.isArray(response.data.documents)) {
          return {
            success: true,
            data: response.data
          }
        }
      }
      
      return {
        success: false,
        data: {
          documents: [],
          total: 0,
          page: 1,
          limit: 20
        },
        error: response.error || 'Error al buscar documentos'
      }
    } catch (error: any) {
      console.error('Error searching documents:', error)
      return {
        success: false,
        data: {
          documents: [],
          total: 0,
          page: 1,
          limit: 20
        },
        error: error.message || 'Error al buscar documentos'
      }
    }
  }

  /**
   * ✅ Verificar documento
   */
  async verifyDocument(id: string): Promise<VerifyDocumentResponse> {
    try {
      console.log(`🔐 DocumentService - Verificando documento: ${id}`)
      
      // Usar fetch directo para evitar problemas con headers en peticiones POST sin cuerpo
      const fullUrl = `${API_CONFIG.backend.baseUrl}${this.baseEndpoint}/${id}/verify`
      console.log(`🔐 DocumentService - URL completa: ${fullUrl}`)
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        credentials: 'include', // 🔑 CLAVE: Envía cookies HttpOnly automáticamente
        headers: {
          'Accept': 'application/json',
          // No incluir Content-Type para peticiones POST sin cuerpo
        }
      })

      console.log(`🔐 DocumentService - Response status: ${response.status}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`🚨 DocumentService - Error ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log(`✅ DocumentService - Verificación exitosa:`, result)
      
      return {
        success: true,
        data: {
          documentId: result.documentId || id,
          isValid: result.isValid || result.success || false,
          message: result.message || 'Verificación completada'
        }
      }
      
    } catch (error: any) {
      console.error('💥 Error verifying document:', error)
      return {
        success: false,
        data: {
            documentId: id,
            isValid: false,
            message: error.message || 'Error en la verificación'
        },
        error: error.message || 'Error al verificar documento'
      }
    }
  }
}

export const documentService = new DocumentService()
