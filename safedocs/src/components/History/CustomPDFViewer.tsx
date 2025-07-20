"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface CustomPDFViewerProps {
  pdfUrl: string;
  className?: string;
}

// Declarar el tipo global para PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export function CustomPDFViewer({ pdfUrl, className }: CustomPDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    // Fallback a iframe si no se puede cargar el visor personalizado
    const timer = setTimeout(() => {
      if (isLoading) {
        setError('Usando visor nativo del navegador');
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Si hay error, mostrar iframe nativo
  if (error) {
    return (
      <div className={`h-full w-full ${className}`}>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-0 rounded-lg"
          title="Vista previa del documento"
          style={{ minHeight: 'calc(98vh - 200px)' }}
        />
        <div className="p-2 bg-gray-100 border-t text-center text-sm text-gray-600 rounded-b-lg">
          📄 Visor PDF Nativo - Controles limitados para mayor seguridad
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Cargando visor PDF avanzado...</span>
          <span className="text-sm text-gray-500">
            Si tarda mucho, se usará el visor nativo del navegador
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg ${className}`}>
      {/* Este es el placeholder para el visor personalizado */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Visor PDF personalizado en desarrollo</p>
      </div>
    </div>
  );
}
