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
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Eye,
  Download
} from "lucide-react";
import { SharedWithMe } from "@/services/documentShare.service";
import { useDocumentShareOperations } from "@/contexts/DocumentShareContext";
import { DocumentViewerDialog } from "./DocumentViewerDialog";

interface SharedDocumentsListProps {
  className?: string;
}

export function SharedDocumentsList({ className }: SharedDocumentsListProps) {
  const { 
    sharedWithMe, 
    loadingSharedWithMe, 
    openSharedDocument, 
    loadSharedWithMe 
  } = useDocumentShareOperations();

  const [refreshing, setRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Estados para el visor de documentos
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState<string | null>(null);
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState<string>('');
  const [currentDocumentType, setCurrentDocumentType] = useState<string>('');
  const [currentShareToken, setCurrentShareToken] = useState<string>('');
  const [currentPermissionLevel, setCurrentPermissionLevel] = useState<string>('read');
  const [loadingDocumentToken, setLoadingDocumentToken] = useState<string | false>(false);

  useEffect(() => {
    // Solo cargar una vez cuando el componente se monta
    if (!hasLoaded && !loadingSharedWithMe) {
      console.log('Cargando documentos compartidos conmigo...');
      loadSharedWithMe().then((data) => {
        console.log('Documentos compartidos cargados:', data);
        setHasLoaded(true);
      }).catch(error => {
        console.error('Error loading shared documents:', error);
        setHasLoaded(true); // Marcamos como cargado aunque haya error
      });
    }
  }, [hasLoaded, loadingSharedWithMe]);

  /**
   * Maneja la apertura de un documento compartido con previsualización
   */
  const handleOpenDocument = async (shareToken: string, documentTitle?: string, permissionLevel: string = 'read') => {
    setLoadingDocumentToken(shareToken); // Usar el token para identificar cuál está cargando
    
    try {
      const result = await openSharedDocument(shareToken, true); // true para mostrar previsualización
      
      if (result && result.success) {
        setCurrentDocumentUrl(result.previewUrl);
        setCurrentDocumentTitle(result.documentTitle || documentTitle || 'Documento compartido');
        setCurrentDocumentType(result.documentType || '');
        setCurrentShareToken(shareToken);
        setCurrentPermissionLevel(permissionLevel);
        setViewerOpen(true);
      }
    } catch (error) {
      console.error('Error abriendo documento:', error);
    } finally {
      setLoadingDocumentToken(false);
    }
  };

  /**
   * Maneja la descarga directa de un documento
   */
  const handleDownloadDocument = async (shareToken: string) => {
    try {
      const result = await openSharedDocument(shareToken, false); // false para descarga directa
      // La descarga se maneja automáticamente en el hook
    } catch (error) {
      console.error('Error descargando documento:', error);
    }
  };
  useEffect(() => {
    console.log('SharedDocumentsList - sharedWithMe actualizado:', sharedWithMe);
  }, [sharedWithMe]);

  /**
   * Refresca la lista de documentos
   */
  const refreshDocuments = async () => {
    setRefreshing(true);
    try {
      await loadSharedWithMe();
    } catch (error) {
      console.error('Error refreshing documents:', error);
    } finally {
      setRefreshing(false);
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
      case 'comment':
        return 'bg-green-100 text-green-800 border-green-200';
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
      case 'comment':
        return 'Descargar';
      default:
        return level;
    }
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
      <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No tienes documentos compartidos</h3>
      <p className="text-sm text-muted-foreground">
        Los documentos que otros usuarios compartan contigo aparecerán aquí
      </p>
    </div>
  );

  /**
   * Renderiza una tarjeta de documento compartido
   */
  const renderDocumentCard = (share: SharedWithMe) => (
    <Card key={share.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {share.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {share.description || "Sin descripción"}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={getPermissionColor(share.permission_level)}
          >
            <Shield className="h-3 w-3 mr-1" />
            {getPermissionText(share.permission_level)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del documento */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{share.doc_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Compartido por:</span>
            <span className="font-medium">{share.shared_by}</span>
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Compartido:</span>
            <span className="font-medium">{formatDate(share.created_at)}</span>
          </div>
          {share.expires_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expira:</span>
              <span className={`font-medium ${share.is_expired ? 'text-red-600' : 'text-green-600'}`}>
                {share.is_expired ? 'Expirado' : formatDate(share.expires_at)}
              </span>
            </div>
          )}
        </div>

        {/* Advertencia si está expirado */}
        {share.is_expired && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">
              Este documento ha expirado y ya no está disponible
            </span>
          </div>
        )}

        <Separator />

        {/* Acciones */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Token: {share.share_token.substring(0, 12)}...
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleOpenDocument(share.share_token, share.title, share.permission_level)}
              disabled={share.is_expired || loadingDocumentToken === share.share_token}
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {loadingDocumentToken === share.share_token ? 'Cargando...' : 'Vista previa'}
            </Button>
            
            {/* Mostrar botón de descarga solo si tiene permiso 'comment' */}
            {share.permission_level === 'comment' && (
              <Button
                onClick={() => handleDownloadDocument(share.share_token)}
                disabled={share.is_expired}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                title="Descargar documento"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loadingSharedWithMe) {
    return renderLoading();
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Documentos compartidos conmigo</h2>
          <p className="text-muted-foreground">
            {(sharedWithMe || []).length} {(sharedWithMe || []).length === 1 ? 'documento' : 'documentos'} compartido{(sharedWithMe || []).length === 1 ? '' : 's'}
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

      {!(sharedWithMe || []).length ? (
        renderEmpty()
      ) : (
        <div className="space-y-4">
          {(sharedWithMe || []).map(renderDocumentCard)}
        </div>
      )}

      {/* Diálogo de vista previa de documentos */}
      <DocumentViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        documentUrl={currentDocumentUrl}
        documentTitle={currentDocumentTitle}
        documentType={currentDocumentType}
        isLoading={!!loadingDocumentToken}
        allowDownload={currentPermissionLevel === 'write' || currentPermissionLevel === 'admin'}
        shareToken={currentShareToken}
      />
    </div>
  );
}
