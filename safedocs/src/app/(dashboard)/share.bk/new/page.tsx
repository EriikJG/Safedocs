'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/lib/supabase'; // ❌ DESHABILITADO: Inseguro, usa localStorage
import { DashboardTitle } from '@/components/Sliderbar/DashboardTitle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Plus, Loader2 } from 'lucide-react';

export default function NewSharePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // TODO: Migrar a backend seguro usando apiClient
      setError('Esta funcionalidad se migrará a cookies HttpOnly seguras. Por ahora está deshabilitada.');
      return;
      
      // // Crear un nuevo chat grupal
      // const { data: shareData, error: shareError } = await supabase
      //   .from('document_shares')
      //   .insert({
      //     document_id: null, // Permitir null para chat grupal general
      //     created_by: user.id,
      //     title: formData.title || 'Chat Grupal',
      //     message: formData.message || 'Bienvenidos al chat grupal',
      //     is_active: true,
      //   })
      //   .select('id, share_token')
      //   .single();

      // if (shareError) {
      //   console.error('Error creando el chat:', shareError);
      //   setError('Error al crear el chat grupal. Intenta de nuevo.');
      //   return;
      // }

      // // Insertar mensaje de bienvenida del sistema
      // await supabase.from('document_share_messages').insert({
      //   share_id: shareData.id, // Usar el ID del share
      //   sender_id: null,
      //   content: `${user.email || 'Un usuario'} ha creado el chat grupal: ${formData.title || 'Chat Grupal'}`,
      //   msg_type: 'system',
      // });

      // // Redirigir al chat creado
      // router.push(`/share/${shareData.share_token}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardTitle>Crear Chat Grupal</DashboardTitle>
      
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Nuevo Chat Grupal
            </CardTitle>
            <CardDescription>
              Crea un nuevo chat grupal para conversar con otros usuarios de la plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Título del Chat
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Equipo de Desarrollo, Chat General..."
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje de Bienvenida (Opcional)
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe de qué trata este chat o añade instrucciones..."
                  rows={3}
                />
              </div>

              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Chat
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
