'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardTitle } from '@/components/Sliderbar/DashboardTitle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Users } from 'lucide-react';

/**
 * Página índice de /share
 * Permite crear un nuevo chat grupal o acceder a uno existente
 */
export default function ShareIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardTitle>Chat Grupal</DashboardTitle>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Chat Seguro Grupal</h1>
          <p className="text-muted-foreground">
            Comunícate de forma segura con otros usuarios de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crear nuevo chat */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Crear Nuevo Chat
              </CardTitle>
              <CardDescription>
                Inicia un nuevo chat grupal para conversar con otros usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/share/new')}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Crear Chat Grupal
              </Button>
            </CardContent>
          </Card>

          {/* Unirse a chat */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Unirse a Chat
              </CardTitle>
              <CardDescription>
                ¿Tienes un enlace de chat? Ingresa el código para unirte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  const token = prompt('Ingresa el token del chat:');
                  if (token) {
                    router.push(`/share/${token}`);
                  }
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ingresar Token
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">¿Cómo funciona?</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Crea un nuevo chat grupal y comparte el enlace con otros usuarios</p>
                <p>• Los mensajes son en tiempo real y seguros</p>
                <p>• Solo usuarios registrados en la plataforma pueden participar</p>
                <p>• Puedes acceder a cualquier chat con su token correspondiente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
