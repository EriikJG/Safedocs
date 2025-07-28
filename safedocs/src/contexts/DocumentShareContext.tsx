"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  SharedWithMe, 
  DocumentShare, 
  CreateSimpleShare 
} from '@/services/documentShare.service';
import useDocumentShare from '@/hooks/useDocumentShare';

// Tipos para el contexto
interface DocumentShareContextType {
  // Estados
  sharedWithMe: SharedWithMe[];
  mySharedDocuments: DocumentShare[];
  loadingSharedWithMe: boolean;
  loadingMyShared: boolean;
  sharingDocument: boolean;
  
  // Métodos
  loadSharedWithMe: () => Promise<SharedWithMe[]>;
  loadMySharedDocuments: () => Promise<DocumentShare[]>;
  shareDocument: (shareData: CreateSimpleShare) => Promise<any>;
  revokeShare: (shareId: string) => Promise<boolean>;
  openSharedDocument: (shareToken: string, showPreview?: boolean) => Promise<any>;
  checkDocumentPermission: (documentId: string) => Promise<any>;
  searchUsersForSharing: (query: string) => Promise<any>;
  refreshAll: () => Promise<void>;
  clearAll: () => void;
  isRevokingShare: (shareId: string) => boolean;
}

// Crear el contexto
const DocumentShareContext = createContext<DocumentShareContextType | undefined>(undefined);

// Provider del contexto
interface DocumentShareProviderProps {
  children: ReactNode;
}

export function DocumentShareProvider({ children }: DocumentShareProviderProps) {
  const documentShareHook = useDocumentShare();

  return (
    <DocumentShareContext.Provider value={documentShareHook}>
      {children}
    </DocumentShareContext.Provider>
  );
}

// Hook para usar el contexto con manejo de errores
export function useDocumentShareContext() {
  const context = useContext(DocumentShareContext);
  if (context === undefined) {
    throw new Error('useDocumentShareContext must be used within a DocumentShareProvider');
  }
  return context;
}

// Hook personalizado para operaciones específicas
export function useDocumentShareOperations() {
  const context = useDocumentShareContext();
  
  /**
   * Comparte un documento con validación completa
   */
  const shareDocumentWithValidation = async (
    documentId: string,
    sharedWithUserId: string,
    options: {
      permissionLevel?: 'read' | 'comment';
      expiresInHours?: number;
      shareTitle?: string;
      shareMessage?: string;
    } = {}
  ) => {
    if (!documentId || !sharedWithUserId) {
      throw new Error('Document ID and user ID are required');
    }


    // Solo permitir 'read' o 'comment', si no, usar 'read'
    const validPermission = options.permissionLevel === 'comment' ? 'comment' : 'read';
    const shareData: CreateSimpleShare = {
      documentId,
      sharedWithUserId,
      permissionLevel: validPermission,
      expiresInHours: options.expiresInHours || 24,
      shareTitle: options.shareTitle,
      shareMessage: options.shareMessage,
    };

    return await context.shareDocument(shareData);
  };

  /**
   * Revoca un documento con confirmación
   */
  const revokeShareWithConfirmation = async (shareId: string, documentTitle?: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres revocar el acceso a ${documentTitle || 'este documento'}?`
    );
    
    if (!confirmed) {
      return false;
    }

    return await context.revokeShare(shareId);
  };

  /**
   * Obtiene estadísticas de documentos compartidos con manejo de errores
   */
  const getShareStatistics = () => {
    try {
      const { sharedWithMe, mySharedDocuments } = context;
      
      // Verificar que los arrays existan antes de acceder a sus propiedades
      const safeSharedWithMe = sharedWithMe || [];
      const safeMySharedDocuments = mySharedDocuments || [];
      
      const stats = {
        totalSharedWithMe: safeSharedWithMe.length,
        totalMyShared: safeMySharedDocuments.length,
        expiredSharedWithMe: safeSharedWithMe.filter(doc => doc.is_expired).length,
        activeMyShared: safeMySharedDocuments.filter(doc => doc.is_active).length,
        inactiveMyShared: safeMySharedDocuments.filter(doc => !doc.is_active).length,
        permissionBreakdown: {
          read: safeMySharedDocuments.filter(doc => doc.permission_level === 'read').length,
          comment: safeMySharedDocuments.filter(doc => doc.permission_level === 'comment').length,
        }
      };

      return stats;
    } catch (error) {
      console.error('Error getting share statistics:', error);
      // Retornar valores por defecto si hay error
      return {
        totalSharedWithMe: 0,
        totalMyShared: 0,
        expiredSharedWithMe: 0,
        activeMyShared: 0,
        inactiveMyShared: 0,
        permissionBreakdown: {
          read: 0,
          comment: 0,
        }
      };
    }
  };

  return {
    ...context,
    shareDocumentWithValidation,
    revokeShareWithConfirmation,
    getShareStatistics,
  };
}

export default DocumentShareProvider;
