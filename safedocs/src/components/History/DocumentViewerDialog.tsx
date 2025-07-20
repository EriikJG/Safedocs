"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Download, AlertCircle, X, ExternalLink } from 'lucide-react';
import { CustomPDFViewer } from './CustomPDFViewer';

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
  const [iframeError, setIframeError] = useState(false);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && documentUrl) {
      setIframeError(false);
      setIsDocumentLoading(true);
      setBlobUrl(null);
      
      // Para URLs de Supabase, intentar crear un blob URL
      if (isSupabaseUrl(documentUrl)) {
        createBlobFromUrl(documentUrl);
      }
    }
  }, [open, documentUrl]);

  const createBlobFromUrl = async (url: string) => {
    try {
      console.log('🔍 Creando blob URL para:', url);
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const newBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(newBlobUrl);
        console.log('✅ Blob URL creado:', newBlobUrl);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo crear blob URL:', error);
      // Continuar con la URL original
    }
  };

  const handleIframeLoad = () => {
    setIsDocumentLoading(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsDocumentLoading(false);
  };

  const handleDownload = () => {
    if (documentUrl) {
      // Crear un enlace temporal para descarga
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = documentTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para verificar si la URL es de Supabase
  const isSupabaseUrl = (url: string) => {
    return url.includes('supabase.co') || url.includes('supabase');
  };

  // Función para crear un enlace de descarga seguro
  const createDownloadLink = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating download link:', error);
      return url;
    }
  };

  // Detectar si es un PDF
  const isPDF = documentUrl?.toLowerCase().includes('.pdf') || 
                documentUrl?.toLowerCase().includes('application/pdf') || 
                documentType === 'application/pdf' ||
                documentTitle.toLowerCase().includes('.pdf');

  // Usar blob URL si está disponible, sino la URL original
  const displayUrl = blobUrl || documentUrl;
  
  // Para PDFs, agregar parámetros para ocultar toolbar si es posible
  const pdfDisplayUrl = isPDF && displayUrl ? 
    `${displayUrl}${displayUrl.includes('?') ? '&' : '?'}toolbar=0&navpanes=0&scrollbar=0` : 
    (displayUrl || '');

  // Cleanup blob URL al cerrar
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b flex-shrink-0">
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
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-4 overflow-hidden h-full">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Cargando documento...</span>
              </div>
            </div>
          )}

          {!isLoading && !displayUrl && (
            <div className="flex items-center justify-center h-full">
              <Alert className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se pudo cargar el documento. Verifica que tengas permisos para acceder a él.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!isLoading && displayUrl && iframeError && (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 rounded-lg p-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Vista Previa Bloqueada</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Microsoft Edge ha bloqueado la vista previa de este documento por políticas de seguridad.
                </p>
                <p className="text-xs text-muted-foreground mb-6 max-w-md">
                  Esto es normal para documentos de Supabase. El documento está seguro y puedes verlo usando el botón de abajo.
                </p>
              </div>
              
              {/* Información del documento */}
              <div className="w-full max-w-md p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{documentTitle}</h4>
                    <p className="text-xs text-muted-foreground">
                      {isPDF ? 'Documento PDF' : 'Documento'} • Protegido
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  {allowDownload && (
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  )}
                  {!allowDownload && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Vista previa no disponible en este navegador
                    </p>
                  )}
                </div>
              </div>

              {/* Información adicional */}
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>🔒 Documento protegido por SafeDocs</p>
                <p>🛡️ Las restricciones del navegador garantizan tu seguridad</p>
                {documentUrl && isSupabaseUrl(documentUrl) && (
                  <p>📁 Almacenado de forma segura en Supabase</p>
                )}
              </div>
            </div>
          )}

          {!isLoading && displayUrl && !iframeError && (
            <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: 'calc(98vh - 200px)' }}>
              {isPDF ? (
                /* Visor PDF personalizado */
                <CustomPDFViewer 
                  pdfUrl={displayUrl} 
                  className="w-full h-full"
                />
              ) : (
                /* Método para otros documentos */
                <>
                  {isDocumentLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Cargando vista previa...</span>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={displayUrl}
                    className="w-full h-full border-0"
                    title={documentTitle}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ minHeight: 'calc(98vh - 200px)', width: '100%' }}
                    allow="fullscreen"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Información de seguridad */}
        <div className="p-4 pt-2 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>Documento protegido - Solo lectura</span>
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
