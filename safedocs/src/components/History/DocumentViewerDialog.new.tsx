"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Download, AlertCircle, ExternalLink, Shield, Eye } from 'lucide-react';

interface SecureDocumentViewerProps {
  documentUrl: string;
  documentTitle: string;
  documentType?: string;
  onLoad?: () => void;
  onError?: () => void;
}

function SecureDocumentViewer({ 
  documentUrl, 
  documentTitle, 
  documentType, 
  onLoad, 
  onError 
}: SecureDocumentViewerProps) {
  const [viewMethod, setViewMethod] = useState<'iframe' | 'embed' | 'object' | 'link'>('iframe');
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  const isPDF = documentUrl?.toLowerCase().includes('.pdf') || 
                documentType === 'application/pdf' ||
                documentTitle.toLowerCase().includes('.pdf');

  const handleLoadError = () => {
    const nextAttempts = loadAttempts + 1;
    setLoadAttempts(nextAttempts);
    
    // Intentar diferentes métodos de carga
    if (nextAttempts === 1 && isPDF) {
      setViewMethod('embed');
    } else if (nextAttempts === 2 && isPDF) {
      setViewMethod('object');
    } else if (nextAttempts >= 3) {
      setViewMethod('link');
      onError?.();
    }
  };

  const renderViewer = () => {
    const commonProps = {
      className: "w-full h-full border-0",
      title: documentTitle,
      onLoad: onLoad,
      onError: handleLoadError,
      style: { minHeight: '500px' }
    };

    switch (viewMethod) {
      case 'embed':
        if (isPDF) {
          return (
            <embed
              src={documentUrl}
              type="application/pdf"
              {...commonProps}
            />
          );
        }
        break;
      
      case 'object':
        if (isPDF) {
          return (
            <object
              data={documentUrl}
              type="application/pdf"
              {...commonProps}
            >
              <p>Su navegador no puede mostrar PDFs. 
                <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                  Haga clic aquí para descargar el PDF.
                </a>
              </p>
            </object>
          );
        }
        break;
      
      case 'link':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Shield className="mx-auto h-16 w-16 text-orange-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Vista Previa Bloqueada</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Tu navegador ha bloqueado la vista previa de este documento por políticas de seguridad.
            </p>
            <Button 
              onClick={() => window.open(documentUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Documento
            </Button>
          </div>
        );
      
      default: // iframe
        return (
          <iframe
            src={documentUrl}
            {...commonProps}
            allow="fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        );
    }
  };

  return (
    <div className="relative h-full min-h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      {renderViewer()}
    </div>
  );
}

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl?: string | null;
  documentTitle?: string;
  documentType?: string;
  isLoading?: boolean;
  allowDownload?: boolean;
  shareToken?: string;
}

export function DocumentViewerDialog({
  open,
  onOpenChange,
  documentUrl,
  documentTitle = "Documento",
  documentType,
  isLoading = false,
  allowDownload = false,
  shareToken
}: DocumentViewerDialogProps) {
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (open && documentUrl) {
      setIsDocumentLoading(true);
      setShowFallback(false);
    }
  }, [open, documentUrl]);

  const handleIframeLoad = () => {
    setIsDocumentLoading(false);
  };

  const handleIframeError = () => {
    setIsDocumentLoading(false);
    setShowFallback(true);
  };

  const handleDownload = async () => {
    if (documentUrl) {
      try {
        // Intentar descarga mediante fetch para URLs CORS
        const response = await fetch(documentUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documentTitle;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        // Fallback: descarga directa
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = documentTitle;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isSupabaseUrl = (url: string) => {
    return url.includes('supabase.co') || url.includes('supabase');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle className="text-lg">{documentTitle}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              {allowDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!documentUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                disabled={!documentUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir en nueva pestaña
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-4 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Cargando documento...</span>
              </div>
            </div>
          )}

          {!isLoading && !documentUrl && (
            <div className="flex items-center justify-center h-96">
              <Alert className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se pudo cargar el documento. Verifica que tengas permisos para acceder a él.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!isLoading && documentUrl && !showFallback && (
            <div className="relative">
              {isDocumentLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Cargando vista previa...</span>
                  </div>
                </div>
              )}
              
              <SecureDocumentViewer
                documentUrl={documentUrl}
                documentTitle={documentTitle}
                documentType={documentType}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          )}

          {!isLoading && documentUrl && showFallback && (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="text-center">
                <Eye className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Vista Previa del Documento</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {documentTitle}
                </p>
                <p className="text-xs text-muted-foreground mb-6 max-w-md">
                  Tu navegador no puede mostrar este documento directamente debido a 
                  configuraciones de seguridad. Usa los botones de abajo para acceder al contenido.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Documento
                </Button>
                
                {allowDownload && (
                  <Button 
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                )}
              </div>

              {/* Información adicional */}
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div className="flex items-center gap-1 justify-center">
                  <Shield className="h-3 w-3" />
                  <span>Documento protegido por SafeDocs</span>
                </div>
                {isSupabaseUrl(documentUrl) && (
                  <p>📁 Almacenado de forma segura</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información de seguridad */}
        <div className="p-4 pt-2 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              <span>Documento protegido - Acceso controlado</span>
            </div>
            {shareToken && (
              <span>Token: {shareToken.substring(0, 8)}...</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
