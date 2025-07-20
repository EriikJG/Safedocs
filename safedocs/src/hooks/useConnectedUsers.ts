import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';

export interface ConnectedUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  last_seen?: string;
}

export const useConnectedUsers = (shareUuid: string) => {
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener usuarios conectados desde el backend
  const fetchUsers = async () => {
    if (!shareUuid) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(`/api/sharing/${shareUuid}/connected-users`);
      
      if (response.success && response.data) {
        setUsers(response.data.users || []);
      } else {
        console.error('Error fetching connected users:', response.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para conectar un usuario
  const connectUser = async (userData: Partial<ConnectedUser>) => {
    try {
      const response = await apiClient.post(`/api/sharing/${shareUuid}/connect`, userData);
      
      if (response.success) {
        // Refrescar lista de usuarios
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error connecting user:', error);
    }
  };

  // Función para desconectar un usuario
  const disconnectUser = async (userId: string) => {
    try {
      const response = await apiClient.post(`/api/sharing/${shareUuid}/disconnect`, { userId });
      
      if (response.success) {
        // Refrescar lista de usuarios
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error disconnecting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Configurar polling para actualizar usuarios cada 30 segundos
    const interval = setInterval(fetchUsers, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [shareUuid]);

  return {
    users,
    loading,
    connectUser,
    disconnectUser,
    refetch: fetchUsers
  };
};
