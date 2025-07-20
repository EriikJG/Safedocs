import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { AuthUser } from '@/services/auth.service';
import { VerificationResult } from '@/types/verify.types';

export function useVerification(user: AuthUser | null) {
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [lastVerification, setLastVerification] = useState<Date | null>(null);

  // Function to map backend verification data to frontend expected format
  const mapBackendToFrontend = (backendData: any): VerificationResult => {
    return {
      id: backendData.id || '',
      fileName: backendData.document_title || backendData.fileName || 'Documento sin nombre',
      status: mapBackendStatus(backendData.status),
      uploadDate: new Date(backendData.created_at || backendData.uploadDate || Date.now()),
      lastModified: new Date(backendData.created_at || backendData.lastModified || Date.now()),
      hash: backendData.hash_checked || backendData.hash || '',
      size: backendData.size || 0,
      integrity: backendData.integrity_pct || backendData.integrity || 0,
      details: backendData.details || [],
      document_id: backendData.document_id || '',
      file_path: backendData.file_path || ''
    };
  };

  // Map backend status to frontend expected status
  const mapBackendStatus = (backendStatus: string): "verified" | "modified" | "corrupted" | "unknown" => {
    switch (backendStatus) {
      case 'verified':
      case 'success':
        return 'verified';
      case 'failed':
      case 'corrupted':
        return 'corrupted';
      case 'pending':
      case 'modified':
        return 'modified';
      default:
        return 'unknown';
    }
  };

  // Cargar verificaciones anteriores
  useEffect(() => {
    if (!user) return;

    const loadVerifications = async () => {
      try {
        setLoadingData(true);
        console.log('🔍 Cargando verificaciones anteriores...');
        
        // Obtener verificaciones recientes
        const response = await apiClient.get('/api/verification/recent');
        
        if (response.success && response.data) {
          // Map backend data to frontend format
          const mappedResults = (Array.isArray(response.data) ? response.data : []).map(mapBackendToFrontend);
          setResults(mappedResults);
          
          // Calcular última verificación
          if (response.data.length > 0) {
            const latest = response.data[0];
            // Convert string timestamp to Date object
            setLastVerification(new Date(latest.created_at || latest.uploadDate || Date.now()));
          }
        } else {
          console.warn('No se pudieron cargar las verificaciones:', response.error);
          setResults([]);
        }
      } catch (error) {
        console.error('Error cargando verificaciones:', error);
        setResults([]);
      } finally {
        setLoadingData(false);
      }
    };

    loadVerifications();
  }, [user]);

  const handleVerification = async () => {
    if (!user || verifying) return;

    try {
      setVerifying(true);
      setVerificationProgress(0);
      console.log('🔍 Iniciando verificación de documentos...');

      // Simular progreso
      const progressInterval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Ejecutar verificación en el backend
      const response = await apiClient.post('/api/verification/run');
      
      clearInterval(progressInterval);
      setVerificationProgress(100);

      if (response.success && response.data) {
        console.log('✅ Verificación completada:', response.data);
        
        // Actualizar resultados - map backend data to frontend format
        const mappedResults = (Array.isArray(response.data) ? response.data : [response.data]).map(mapBackendToFrontend);
        setResults(mappedResults);
        
        // Actualizar última verificación con fecha actual
        setLastVerification(new Date());
      } else {
        console.error('Error en la verificación:', response.error);
        // Mantener resultados anteriores en caso de error
      }
    } catch (error) {
      console.error('Error durante la verificación:', error);
    } finally {
      setVerifying(false);
      setTimeout(() => setVerificationProgress(0), 2000);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  };

  return {
    verifying,
    verificationProgress,
    results,
    loadingData,
    lastVerification,
    handleVerification,
    formatTimeAgo
  };
}