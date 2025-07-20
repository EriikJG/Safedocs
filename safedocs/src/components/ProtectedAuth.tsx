"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { SimpleLoading } from '@/components/ui/Loading';

interface ProtectedAuthProps {
  children: ReactNode;
}

export function ProtectedAuth({ children }: ProtectedAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (loading) return;

    // Si hay usuario, redirigir al dashboard
    if (user) {
      console.log('🔐 ProtectedAuth - Usuario autenticado, redirigiendo al dashboard');
      router.push('/overview');
      return;
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <SimpleLoading title="Verificando autenticación..." />;
  }

  // Si hay usuario después de cargar, mostrar loading mientras redirige
  if (user) {
    return <SimpleLoading title="Redirigiendo al dashboard..." />;
  }

  // Todo está bien, mostrar el contenido
  return <>{children}</>;
}
