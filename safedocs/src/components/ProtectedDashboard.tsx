"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { SimpleLoading } from '@/components/ui/Loading';

interface ProtectedDashboardProps {
  children: ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (loading) return;

    // Si no hay usuario, redirigir al login
    if (!user) {
      console.log('🔐 ProtectedDashboard - Usuario no autenticado, redirigiendo al login');
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <SimpleLoading title="Verificando autenticación..." />;
  }

  // Si no hay usuario después de cargar, mostrar loading mientras redirige
  if (!user) {
    return <SimpleLoading title="Redirigiendo al login..." />;
  }

  // Todo está bien, mostrar el contenido
  return <>{children}</>;
}
