"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Loading from '@/components/ui/Loading';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (loading) return;

    // Si se requiere autenticación pero no hay usuario
    if (requireAuth && !user) {
      console.log('🔐 AuthGuard - Usuario no autenticado, redirigiendo a:', redirectTo);
      router.push(redirectTo);
      return;
    }

    // Si no se requiere autenticación pero hay usuario (rutas de auth)
    if (!requireAuth && user) {
      console.log('🔐 AuthGuard - Usuario autenticado, redirigiendo a dashboard');
      router.push('/overview');
      return;
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading title="Verificando autenticación..." />;
  }

  // Si se requiere auth pero no hay usuario, mostrar loading mientras redirige
  if (requireAuth && !user) {
    return <Loading title="Redirigiendo al login..." />;
  }

  // Si no se requiere auth pero hay usuario, mostrar loading mientras redirige
  if (!requireAuth && user) {
    return <Loading title="Redirigiendo al dashboard..." />;
  }

  // Todo está bien, mostrar el contenido
  return <>{children}</>;
}
