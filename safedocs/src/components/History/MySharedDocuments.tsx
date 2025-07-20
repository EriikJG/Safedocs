"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Shield, 
  Trash2,
  RefreshCw,
  Share2,
  AlertCircle
} from "lucide-react";
import { DocumentShare } from "@/services/documentShare.service";
import { useDocumentShareOperations } from "@/contexts/DocumentShareContext";

interface MySharedDocumentsProps {
  className?: string;
}

export function MySharedDocuments({ className }: MySharedDocumentsProps) {
  const { 
    mySharedDocuments, 
    loadingMyShared, 
    revokeShareWithConfirmation, 
    loadMySharedDocuments,
    isRevokingShare
  } = useDocumentShareOperations();

  const [refreshing, setRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Solo cargar una vez cuando el componente se monta
    if (!hasLoaded && !loadingMyShared) {
      loadMySharedDocuments().then(() => {
        setHasLoaded(true);
      }).catch(error => {
        console.error('Error loading my shared documents:', error);
        setHasLoaded(true); // Marcamos como cargado aunque haya error
      });
    }
  }, [hasLoaded, loadingMyShared]);

  /**
   * Refresca la lista de documentos
   */
  const refreshDocuments = async () => {
    setRefreshing(true);
    try {
      await loadMySharedDocuments();
    } catch (error) {
      console.error('Error refreshing documents:', error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Revoca un documento compartido
   */
  const handleRevokeShare = async (shareId: string, documentTitle?: string) => {
    try {
      await revokeShareWithConfirmation(shareId, documentTitle);
    } catch (error) {
      console.error("Error revoking share:", error);
    }
  };

  /**
   * Formatea una fecha para mostrar
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Obtiene el color del badge según el nivel de permisos
   */
  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'write':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * Obtiene el texto del nivel de permisos
   */
  const getPermissionText = (level: string) => {
    switch (level) {
      case 'read':
        return 'Solo lectura';
      case 'write':
        return 'Lectura y edición';
      case 'admin':
        return 'Administrador';
      default:
        return level;
    }
  };

  /**
   * Verifica si un documento está expirado
   */
  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = () => (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span>Cargando documentos compartidos...</span>
      </div>
    </div>
  );

  /**
   * Renderiza el estado vacío
   */
  const renderEmpty = () => (
    <div className="text-center py-12">
      <Share2 className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No has compartido documentos</h3>
      <p className="text-sm text-muted-foreground">
        Los documentos que compartas con otros usuarios aparecerán aquí
      </p>
    </div>
  );

  /**
   * Renderiza una tarjeta de documento compartido
   */
  const renderDocumentCard = (share: DocumentShare) => {
    const expired = isExpired(share.expires_at);
    const isRevoking = isRevokingShare(share.id);

    return (
      <Card key={share.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {share.title || "Documento sin título"}
              </CardTitle>
              <CardDescription className="mt-1">
                {share.message || "Sin mensaje"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={getPermissionColor(share.permission_level)}
              >
                <Shield className="h-3 w-3 mr-1" />
                {getPermissionText(share.permission_level)}
              </Badge>
              {!share.is_active && (
                <Badge variant="destructive">
                  Inactivo
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Información del documento */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Compartido con:</span>
              <span className="font-medium">{share.shared_with_user_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Compartido:</span>
              <span className="font-medium">{formatDate(share.created_at)}</span>
            </div>
          </div>

          {/* Fecha de expiración */}
          {share.expires_at && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expira:</span>
              <span className={`font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                {expired ? 'Expirado' : formatDate(share.expires_at)}
              </span>
            </div>
          )}

          {/* Advertencia si está expirado o inactivo */}
          {(expired || !share.is_active) && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600">
                {expired ? 'Este documento ha expirado' : 'Este documento está inactivo'}
              </span>
            </div>
          )}

          <Separator />

          {/* Acciones */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Token: {share.share_token.substring(0, 12)}...
            </div>
            <Button
              onClick={() => handleRevokeShare(share.id, share.title)}
              disabled={isRevoking}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isRevoking ? "Revocando..." : "Revocar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loadingMyShared) {
    return renderLoading();
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Documentos que he compartido</h2>
          <p className="text-muted-foreground">
            {(mySharedDocuments || []).length} {(mySharedDocuments || []).length === 1 ? 'documento' : 'documentos'} compartido{(mySharedDocuments || []).length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshDocuments}
          disabled={refreshing}
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {!(mySharedDocuments || []).length ? (
        renderEmpty()
      ) : (
        <div className="space-y-4">
          {(mySharedDocuments || []).map(renderDocumentCard)}
        </div>
      )}
    </div>
  );
}
