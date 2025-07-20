import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  documentShareService, 
  SharedWithMe, 
  DocumentShare, 
  CreateSimpleShare 
} from '@/services/documentShare.service';

/**
 * Hook personalizado para manejar toda la funcionalidad de compartir documentos
 * Proporciona métodos y estados centralizados para la funcionalidad de compartir
 */
export function useDocumentShare() {
  // Estados inicializados con arrays vacíos
  const [sharedWithMe, setSharedWithMe] = useState<SharedWithMe[]>([]);
  const [mySharedDocuments, setMySharedDocuments] = useState<DocumentShare[]>([]);
  const [loadingSharedWithMe, setLoadingSharedWithMe] = useState(false);
  const [loadingMyShared, setLoadingMyShared] = useState(false);
  const [sharingDocument, setSharingDocument] = useState(false);
  const [revokingShare, setRevokingShare] = useState<Set<string>>(new Set());

  /**
   * Carga los documentos compartidos conmigo
   */
  const loadSharedWithMe = useCallback(async () => {
    setLoadingSharedWithMe(true);
    try {
      console.log('Hook: Cargando documentos compartidos conmigo...');
      const documents = await documentShareService.getSharedWithMe();
      console.log('Hook: Documentos recibidos:', documents);
      setSharedWithMe(documents);
      return documents;
    } catch (error) {
      console.error('Error loading shared documents:', error);
      toast.error('Error al cargar documentos compartidos');
      throw error;
    } finally {
      setLoadingSharedWithMe(false);
    }
  }, []);

  /**
   * Carga los documentos que yo he compartido
   */
  const loadMySharedDocuments = useCallback(async () => {
    setLoadingMyShared(true);
    try {
      const documents = await documentShareService.getMySharedDocuments();
      setMySharedDocuments(documents);
      return documents;
    } catch (error) {
      console.error('Error loading my shared documents:', error);
      toast.error('Error al cargar mis documentos compartidos');
      throw error;
    } finally {
      setLoadingMyShared(false);
    }
  }, []);

  /**
   * Comparte un documento con otro usuario
   */
  const shareDocument = useCallback(async (shareData: CreateSimpleShare) => {
    setSharingDocument(true);
    try {
      const result = await documentShareService.shareDocument(shareData);
      
      // Verificar si la respuesta es exitosa (puede ser undefined o true)
      if (result && (result.success === true || result.success === undefined)) {
        toast.success('Documento compartido exitosamente');
        // Recargar la lista de documentos compartidos
        await loadMySharedDocuments();
        return result;
      } else {
        const errorMessage = result?.message || 'Error al compartir el documento';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al compartir el documento';
      toast.error(errorMessage);
      throw error;
    } finally {
      setSharingDocument(false);
    }
  }, [loadMySharedDocuments]);

  /**
   * Revoca un documento compartido
   */
  const revokeShare = useCallback(async (shareId: string) => {
    setRevokingShare(prev => new Set(prev).add(shareId));
    try {
      await documentShareService.revokeShare(shareId);
      toast.success('Documento revocado exitosamente');
      
      // Actualizar la lista local eliminando el documento revocado
      setMySharedDocuments(prev => prev.filter(doc => doc.id !== shareId));
      
      return true;
    } catch (error) {
      console.error('Error revoking share:', error);
      toast.error('Error al revocar el documento');
      throw error;
    } finally {
      setRevokingShare(prev => {
        const newSet = new Set(prev);
        newSet.delete(shareId);
        return newSet;
      });
    }
  }, []);

  /**
   * Abre un documento compartido
   */
  const openSharedDocument = useCallback(async (shareToken: string, showPreview: boolean = true) => {
    try {
      const sharedDoc = await documentShareService.getSharedDocument(shareToken);
      
      if (sharedDoc && sharedDoc.document?.signed_file_url) {
        if (showPreview) {
          // Retornar los datos para que el componente pueda mostrar la previsualización
          return {
            success: true,
            data: sharedDoc,
            previewUrl: sharedDoc.document.signed_file_url,
            documentTitle: sharedDoc.document.title || sharedDoc.share?.title || 'Documento compartido',
            documentType: sharedDoc.document.mime_type,
            shareToken: shareToken
          };
        } else {
          // Comportamiento original: abrir en nueva ventana
          window.open(sharedDoc.document.signed_file_url, '_blank');
          toast.success('Documento abierto en nueva ventana');
          return sharedDoc;
        }
      } else {
        toast.error('No se pudo obtener la URL del documento');
        throw new Error('No se pudo obtener la URL del documento');
      }
    } catch (error) {
      console.error('Error opening shared document:', error);
      toast.error('Error al abrir el documento compartido');
      throw error;
    }
  }, []);

  /**
   * Verifica los permisos de un documento
   */
  const checkDocumentPermission = useCallback(async (documentId: string) => {
    try {
      const permissions = await documentShareService.checkDocumentPermission(documentId);
      return permissions;
    } catch (error) {
      console.error('Error checking document permissions:', error);
      toast.error('Error al verificar permisos del documento');
      throw error;
    }
  }, []);

  /**
   * Busca usuarios para compartir
   */
  const searchUsersForSharing = useCallback(async (query: string) => {
    try {
      const result = await documentShareService.searchUsersForSharing(query);
      return result;
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error al buscar usuarios');
      throw error;
    }
  }, []);

  /**
   * Refresca todas las listas de documentos compartidos
   */
  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        loadSharedWithMe(),
        loadMySharedDocuments()
      ]);
      toast.success('Listas actualizadas');
    } catch (error) {
      console.error('Error refreshing shared documents:', error);
      toast.error('Error al actualizar las listas');
    }
  }, [loadSharedWithMe, loadMySharedDocuments]);

  /**
   * Limpia todos los estados
   */
  const clearAll = useCallback(() => {
    setSharedWithMe([]);
    setMySharedDocuments([]);
    setRevokingShare(new Set());
  }, []);

  return {
    // Estados
    sharedWithMe,
    mySharedDocuments,
    loadingSharedWithMe,
    loadingMyShared,
    sharingDocument,
    revokingShare,
    
    // Métodos
    loadSharedWithMe,
    loadMySharedDocuments,
    shareDocument,
    revokeShare,
    openSharedDocument,
    checkDocumentPermission,
    searchUsersForSharing,
    refreshAll,
    clearAll,
    
    // Utilidades
    isRevokingShare: (shareId: string) => revokingShare.has(shareId),
  };
}

export default useDocumentShare;
