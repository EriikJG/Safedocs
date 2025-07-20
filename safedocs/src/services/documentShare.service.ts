import { apiClient } from '@/lib/api-client';

// === INTERFACES ACTUALIZADAS PARA COOKIES HTTPONLY ===

/**
 * Datos para crear un nuevo documento compartido
 */
export interface CreateSimpleShare {
  documentId: string;
  sharedWithUserId: string;
  permissionLevel: 'read' | 'write' | 'admin';
  expiresInHours: number;
  shareTitle?: string;
  shareMessage?: string;
}

/**
 * Usuario disponible para compartir documentos
 */
export interface UserForSharing {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  company?: string;
}

/**
 * Respuesta de búsqueda de usuarios
 */
export interface UserSearchResponse {
  users: UserForSharing[];
  message?: string;
  error?: string;
}

/**
 * Información completa de un documento compartido
 */
export interface DocumentShare {
  id: string;
  document_id: string;
  shared_with_user_id: string;
  created_by: string;
  share_token: string;
  title?: string;
  message?: string;
  permission_level: 'read' | 'write' | 'admin';
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Respuesta al compartir un documento
 */
export interface ShareResponse {
  success: boolean;
  message: string;
  share: DocumentShare;
  share_token: string;
}

/**
 * Documento compartido con información completa
 */
export interface SharedDocument {
  share: {
    id: string;
    title?: string;
    message?: string;
    permission_level: 'read' | 'write' | 'admin';
    created_at: string;
    expires_at?: string;
  };
  document: {
    id: string;
    title: string;
    description?: string;
    doc_type: string;
    file_size?: number;
    mime_type?: string;
    created_at: string;
    signed_file_url: string;
    owner_id: string;
  };
}

/**
 * Documento compartido conmigo
 */
export interface SharedWithMe {
  id: string;
  document_id: string;
  title: string;
  description?: string;
  doc_type: string;
  permission_level: 'read' | 'write' | 'admin';
  shared_by: string;
  expires_at?: string;
  is_expired: boolean;
  created_at: string;
  share_token: string;
  document: {
    id: string;
    title: string;
    description?: string;
    doc_type: string;
    created_at: string;
    owner_id: string;
  };
}

/**
 * Respuesta del API con datos envueltos
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// === SERVICIO DE COMPARTIR DOCUMENTOS ===
/**
 * Servicio para manejar todas las operaciones de compartir documentos
 * Usa cookies HttpOnly para autenticación automática
 */
export const documentShareService = {
  /**
   * Comparte un documento con otro usuario
   * @param shareData - Datos del documento a compartir
   * @returns Promise con la respuesta del compartir
   */
  async shareDocument(shareData: CreateSimpleShare): Promise<ShareResponse> {
    try {
      const response = await apiClient.post('/documentos/simple-share', shareData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      console.log('Respuesta raw del API:', response);
      
      // Manejar diferentes formatos de respuesta del backend
      const data = response.data;
      
      // Si ya tiene la estructura esperada, devolverla tal como está
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ShareResponse;
      }
      
      // Si no tiene la estructura esperada, crearla
      return {
        success: true,
        message: 'Documento compartido exitosamente',
        share: data as DocumentShare,
        share_token: data?.share_token || data?.token || ''
      };
    } catch (error) {
      console.error('Error en shareDocument service:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los documentos compartidos conmigo
   * @returns Promise con la lista de documentos compartidos
   */
  async getSharedWithMe(): Promise<SharedWithMe[]> {
    const response = await apiClient.get('/documentos/shared-with-me');
    if (response.error) {
      throw new Error(response.error);
    }
    
    console.log('Respuesta raw getSharedWithMe:', response.data);
    
    // El backend devuelve { success: true, data: [...] }
    const apiResponse = response.data;
    
    // Si tiene estructura { success: true, data: [...] }, devolver data
    if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
      return apiResponse.data as SharedWithMe[];
    }
    
    // Si es directamente un array, devolverlo
    if (Array.isArray(apiResponse)) {
      return apiResponse as SharedWithMe[];
    }
    
    // Si no tiene la estructura esperada, devolver array vacío
    return [];
  },

  /**
   * Obtiene todos los documentos que yo he compartido
   * @returns Promise con la lista de documentos que he compartido
   */
  async getMySharedDocuments(): Promise<DocumentShare[]> {
    const response = await apiClient.get('/documentos/my-shared');
    if (response.error) {
      throw new Error(response.error);
    }
    
    console.log('Respuesta raw getMySharedDocuments:', response.data);
    
    const apiResponse = response.data;
    
    // Si tiene estructura { success: true, data: [...] }, devolver data
    if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
      return apiResponse.data as DocumentShare[];
    }
    
    // Si es directamente un array, devolverlo
    if (Array.isArray(apiResponse)) {
      return apiResponse as DocumentShare[];
    }
    
    // Si no tiene la estructura esperada, devolver array vacío
    return [];
  },

  /**
   * Obtiene un documento compartido por su token
   * @param shareToken - Token del documento compartido
   * @returns Promise con el documento compartido
   */
  async getSharedDocument(shareToken: string): Promise<SharedDocument> {
    const response = await apiClient.get(`/documentos/shared/${shareToken}`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as SharedDocument;
  },

  /**
   * Revoca un documento compartido
   * @param shareId - ID del share a revocar
   * @returns Promise que se resuelve cuando se revoca
   */
  async revokeShare(shareId: string): Promise<void> {
    const response = await apiClient.delete(`/documentos/shares/${shareId}/revoke`);
    if (response.error) {
      throw new Error(response.error);
    }
  },

  /**
   * Verifica los permisos de un documento
   * @param documentId - ID del documento
   * @returns Promise con los permisos del documento
   */
  async checkDocumentPermission(documentId: string): Promise<any> {
    const response = await apiClient.get(`/documentos/${documentId}/permission-check`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  },

  /**
   * Obtiene un documento con verificación de permisos
   * @param documentId - ID del documento
   * @returns Promise con el documento y permisos
   */
  async getDocumentWithPermissionCheck(documentId: string): Promise<any> {
    const response = await apiClient.get(`/documentos/${documentId}/with-permission-check`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  },

  /**
   * Busca usuarios para compartir documentos
   * @param query - Texto de búsqueda
   * @returns Promise con la lista de usuarios encontrados
   */
  async searchUsersForSharing(query: string): Promise<UserSearchResponse> {
    if (!query || query.length < 3) {
      return {
        users: [],
        message: 'Escribe al menos 3 caracteres para buscar'
      };
    }

    const response = await apiClient.get(`/share/search-users?q=${encodeURIComponent(query)}`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as UserSearchResponse;
  },

  /**
   * Obtiene la lista de usuarios que ya tienen acceso a un documento
   * @param documentId - ID del documento
   * @returns Promise con la lista de usuarios con acceso
   */
  async getDocumentSharedUsers(documentId: string): Promise<{ users: any[], error?: string }> {
    const response = await apiClient.get(`/share/document-users/${documentId}`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as { users: any[], error?: string };
  }
};
