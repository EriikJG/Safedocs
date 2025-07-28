"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Shield 
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ProtectedPDFViewerProps {
  pdfUrl: string;
  className?: string;
  onLoadSuccess?: () => void;
  onLoadError?: () => void;
}

export function ProtectedPDFViewer({ 
  pdfUrl, 
  className, 
  onLoadSuccess, 
  onLoadError 
}: ProtectedPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Protección contra impresión
  useEffect(() => {
    let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Ocultar el contenido del PDF antes de imprimir
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
        
        // Crear un div temporal con mensaje de protección
        const printBlockDiv = document.createElement('div');
        printBlockDiv.id = 'print-protection-message';
        printBlockDiv.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          font-family: Arial, sans-serif;
          font-size: 24px;
          color: #dc2626;
          text-align: center;
          padding: 40px;
        `;
        printBlockDiv.innerHTML = `
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
            </svg>
            <span>🚫</span>
          </div>
          <h1 style="margin-bottom: 20px; font-size: 32px; font-weight: bold;">Impresión Deshabilitada</h1>
          <p style="margin-bottom: 15px; font-size: 18px; color: #666; max-width: 600px; line-height: 1.5;">
            Este documento está protegido y no puede ser impreso por políticas de seguridad.
          </p>
          <p style="font-size: 16px; color: #666; max-width: 500px; line-height: 1.4;">
            Para obtener una copia, contacta al propietario del documento.
          </p>
          <button 
            id="close-print-protection"
            style="
              margin-top: 30px; 
              padding: 12px 24px; 
              background: #3b82f6; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-size: 16px; 
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.2s;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            "
            onmouseover="this.style.background='#2563eb'"
            onmouseout="this.style.background='#3b82f6'"
          >
            ← Presiona Esc para regresar
          </button>
          <div style="margin-top: 30px; padding: 20px; background: #fee2e2; border: 2px solid #fecaca; border-radius: 8px; color: #991b1b;">
            <strong>SafeDocs - Protección de Documentos</strong>
          </div>
        `;
        
        document.body.appendChild(printBlockDiv);
        
        // Agregar event listener al botón de cerrar
        const closeButton = printBlockDiv.querySelector('#close-print-protection');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            handleAfterPrint();
          });
        }
        
        // Crear y agregar event listener para la tecla Escape
        escapeHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            handleAfterPrint();
          }
        };
        document.addEventListener('keydown', escapeHandler);
      }
      
      return false;
    };

    const handleAfterPrint = () => {
      // Restaurar el contenido después de intentar imprimir
      if (containerRef.current) {
        containerRef.current.style.display = 'flex';
      }
      
      // Remover event listener del Escape
      if (escapeHandler) {
        document.removeEventListener('keydown', escapeHandler);
        escapeHandler = null;
      }
      
      // Eliminar el mensaje de protección
      const printBlockDiv = document.getElementById('print-protection-message');
      if (printBlockDiv) {
        document.body.removeChild(printBlockDiv);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear Ctrl+P
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        e.stopPropagation();
        handleBeforePrint(e);
        return false;
      }
    };

    const handleContextMenu = (e: Event) => {
      // Bloquear clic derecho en el área del PDF
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        return false;
      }
    };

    // CSS para ocultar durante la impresión
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .protected-pdf-viewer {
          display: none !important;
        }
        body {
          background: white !important;
        }
        body::before {
          content: "🚫 LA IMPRESIÓN ESTÁ DESHABILITADA PARA ESTE DOCUMENTO 🚫";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 32px;
          font-weight: bold;
          color: #dc2626;
          text-align: center;
          white-space: nowrap;
          z-index: 999999;
        }
        body::after {
          content: "SafeDocs - Protección de Documentos";
          position: fixed;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          color: #666;
          text-align: center;
          z-index: 999999;
        }
      }
    `;
    document.head.appendChild(style);

    // Agregar event listeners
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // Cleanup
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      const printBlockDiv = document.getElementById('print-protection-message');
      if (printBlockDiv && printBlockDiv.parentNode) {
        printBlockDiv.parentNode.removeChild(printBlockDiv);
      }
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    onLoadSuccess?.();
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Error al cargar el documento PDF');
    setLoading(false);
    onLoadError?.();
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg ${className}`}>
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar PDF</h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          {error}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Intenta recargar la página o contacta al administrador
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`protected-pdf-viewer flex flex-col bg-gray-50 rounded-lg overflow-hidden ${className}`}
    >
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Vista Protegida</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : '--'}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área del documento */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <span className="text-sm text-gray-600">Cargando documento protegido...</span>
          </div>
        )}

        <div className="flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
            noData={null}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={null}
              error={null}
              noData={null}
              renderTextLayer={false} // Deshabilitar capa de texto para mayor protección
              renderAnnotationLayer={false} // Deshabilitar anotaciones
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>

      {/* Mensaje de protección */}
      <div className="p-2 bg-blue-50 border-t border-blue-200">
        <div className="flex items-center justify-center gap-2 text-xs text-blue-800">
          <Shield className="h-3 w-3" />
          <span>Documento protegido - Impresión deshabilitada por SafeDocs</span>
        </div>
      </div>
    </div>
  );
}
