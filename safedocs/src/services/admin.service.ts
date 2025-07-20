import { apiClient } from '@/lib/api-client'
import { API_CONFIG } from '@/config/api'

export interface AdminUser {
  id: string
  email: string
  name?: string
  username?: string
  role: 'owner' | 'admin' | 'auditor' | 'recipient'
  email_confirmed: boolean
  created_at: string
  updated_at: string
}

export interface AdminResponse {
  success: boolean
  data?: AdminUser[]
  error?: string
}

export interface AdminActionResponse {
  success: boolean
  data?: any
  error?: string
}

class AdminService {
  private readonly baseURL = `${API_CONFIG.backend.baseUrl}${API_CONFIG.backend.endpoints.auth}`

  /**
   * 👥 Obtener lista de todos los usuarios (usando tu endpoint existente)
   */
  async getUsers(): Promise<AdminResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/admin/users`)
      
      console.log('📋 Respuesta del backend:', response)
      
      // Verificar si la respuesta es exitosa
      if (response.success && response.data) {
        // Verificar si la respuesta tiene el formato esperado del backend
        if ((response.data as any).users && Array.isArray((response.data as any).users)) {
          // Mapear los datos del endpoint a la estructura esperada
          const users: AdminUser[] = (response.data as any).users.map((user: any) => ({
            id: user.id,
            email: user.email || `user-${user.id}@example.com`,
            name: user.name || user.username || `Usuario ${user.id}`,
            username: user.username || user.id,
            role: user.role as 'owner' | 'admin' | 'auditor' | 'recipient',
            email_confirmed: true, // Asumimos que están confirmados si tienen rol
            created_at: user.roleAssignedAt || new Date().toISOString(),
            updated_at: user.roleUpdatedAt || new Date().toISOString()
          }))
          
          return {
            success: true,
            data: users
          }
        }
        
        // Si response.data es directamente un array de usuarios
        if (Array.isArray(response.data)) {
          const users: AdminUser[] = response.data.map((user: any) => ({
            id: user.id,
            email: user.email || `user-${user.id}@example.com`,
            name: user.name || user.username || `Usuario ${user.id}`,
            username: user.username || user.id,
            role: user.role as 'owner' | 'admin' | 'auditor' | 'recipient',
            email_confirmed: true,
            created_at: user.roleAssignedAt || new Date().toISOString(),
            updated_at: user.roleUpdatedAt || new Date().toISOString()
          }))
          
          return {
            success: true,
            data: users
          }
        }
      }
      
      // Si hay error en la respuesta
      if (response.error) {
        return {
          success: false,
          error: response.error || 'Error al obtener usuarios'
        }
      }
      
      return {
        success: false,
        error: 'No se encontraron usuarios o estructura de respuesta inesperada'
      }
    } catch (error: any) {
      console.error('💥 Error fetching users:', error)
      
      // Manejo específico de errores HTTP
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado. Solo administradores pueden ver todos los usuarios.'
        }
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener usuarios'
      }
    }
  }

  /**
   * 🔄 Actualizar rol de usuario (usando tu endpoint existente)
   */
  /**
   * 🔄 Actualizar rol de usuario (usando tu endpoint existente)
   */
  async updateUserRole(userId: string, newRole: string): Promise<AdminActionResponse> {
    try {
      console.log(`🔄 Actualizando rol de usuario ${userId} a ${newRole}`)
      
      const response = await apiClient.post(`${this.baseURL}/admin/assign-role`, {
        userId: userId,
        role: newRole
      })
      
      console.log('🔄 Respuesta del servidor:', response)
      
      // Verificar si la respuesta es exitosa
      if (response.success) {
        return {
          success: true,
          data: response.data || { message: 'Rol asignado exitosamente' }
        }
      }
      
      // Si hay error en la respuesta
      if (response.error) {
        return {
          success: false,
          error: response.error || 'Error al actualizar el rol'
        }
      }
      
      return {
        success: false,
        error: 'Error al actualizar el rol'
      }
    } catch (error: any) {
      console.error('💥 Error updating user role:', error)
      
      // Manejo específico de errores HTTP
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado. Solo administradores pueden cambiar roles.'
        }
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
        }
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: 'Rol inválido. Los roles válidos son: owner, admin, auditor, recipient'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al actualizar el rol'
      }
    }
  }

  /**
   * 🗑️ Eliminar usuario 
   */
  async deleteUser(userId: string): Promise<AdminActionResponse> {
    try {
      console.log(`🗑️ Intentando eliminar usuario: ${userId}`)
      
      // Agregar endpoint para eliminar usuarios si no existe
      const response = await apiClient.delete(`${this.baseURL}/admin/users/${userId}`)
      
      console.log('🗑️ Respuesta del servidor:', response)
      
      // Si la respuesta es exitosa (sin importar el formato exacto)
      if (response.success !== false) {
        console.log('✅ Usuario eliminado exitosamente')
        return {
          success: true,
          data: response.data || response || { message: 'Usuario eliminado exitosamente' }
        }
      }
      
      // Si hay un error específico en la respuesta
      console.log('❌ Error en la respuesta:', response)
      return {
        success: false,
        error: (response as any).error || (response as any).message || 'Error al eliminar el usuario'
      }
    } catch (error: any) {
      console.error('💥 Error en deleteUser:', error)
      
      // Si es 404, significa que el endpoint no existe
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Funcionalidad de eliminación no implementada en el backend'
        }
      }
      
      // Para otros errores HTTP pero que pueden ser exitosos (como 200, 204)
      if (error.response?.status >= 200 && error.response?.status < 300) {
        console.log('✅ Usuario eliminado exitosamente (status code exitoso)')
        return {
          success: true,
          data: { message: 'Usuario eliminado exitosamente' }
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al eliminar el usuario'
      }
    }
  }

  /**
   * 📊 Obtener estadísticas del sistema
   */
  async getSystemStats(): Promise<AdminActionResponse> {
    try {
      // Usar el endpoint de usuarios y calcular estadísticas
      const usersResponse = await this.getUsers()
      
      if (usersResponse.success && usersResponse.data) {
        const users = usersResponse.data
        const stats = {
          totalUsers: users.length,
          adminUsers: users.filter(u => u.role === 'admin').length,
          ownerUsers: users.filter(u => u.role === 'owner').length,
          activeUsers: users.filter(u => u.email_confirmed).length,
          inactiveUsers: users.filter(u => !u.email_confirmed).length,
          recentlyCreated: users.filter(u => {
            const createdAt = new Date(u.created_at)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return createdAt >= weekAgo
          }).length
        }
        
        return {
          success: true,
          data: stats
        }
      }
      
      return {
        success: false,
        error: usersResponse.error || 'Error al obtener estadísticas'
      }
    } catch (error: any) {
      console.error('Error fetching system stats:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener estadísticas'
      }
    }
  }

  /**
   * 🔍 Buscar usuario por email
   */
  async searchUser(email: string): Promise<AdminActionResponse> {
    try {
      // Obtener todos los usuarios y filtrar por email
      const usersResponse = await this.getUsers()
      
      if (usersResponse.success && usersResponse.data) {
        const user = usersResponse.data.find(u => 
          u.email.toLowerCase().includes(email.toLowerCase()) || 
          u.name?.toLowerCase().includes(email.toLowerCase()) ||
          u.username?.toLowerCase().includes(email.toLowerCase())
        )
        
        if (user) {
          return {
            success: true,
            data: user
          }
        }
      }
      
      return {
        success: false,
        error: 'Usuario no encontrado'
      }
    } catch (error: any) {
      console.error('Error searching user:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al buscar usuario'
      }
    }
  }

  /**
   * 🔒 Cambiar estado de activación de usuario
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<AdminActionResponse> {
    try {
      // Intentar usar un endpoint de toggle status si existe
      const response = await apiClient.post(`${this.baseURL}/admin/toggle-status`, {
        userId: userId,
        isActive: isActive
      })
      
      if (response.success !== false) {
        return {
          success: true,
          data: response
        }
      }
      
      return {
        success: false,
        error: (response as any).error || (response as any).message || 'Error al cambiar el estado del usuario'
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error)
      
      // Si es 404, significa que el endpoint no existe
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Funcionalidad de cambio de estado no implementada en el backend'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al cambiar el estado del usuario'
      }
    }
  }

  /**
   * 📋 Obtener logs de actividad del sistema
   */
  async getActivityLogs(limit: number = 50, offset: number = 0): Promise<AdminActionResponse> {
    try {
      // Intentar usar un endpoint de logs si existe
      const response = await apiClient.get(`${this.baseURL}/admin/activity-logs?limit=${limit}&offset=${offset}`)
      
      if (response.success !== false) {
        return {
          success: true,
          data: response
        }
      }
      
      return {
        success: false,
        error: (response as any).error || (response as any).message || 'Error al obtener logs de actividad'
      }
    } catch (error: any) {
      console.error('Error fetching activity logs:', error)
      
      // Si es 404, significa que el endpoint no existe
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Funcionalidad de logs de actividad no implementada en el backend'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener logs de actividad'
      }
    }
  }

  /**
   * 📊 Obtener métricas del sistema
   */
  async getSystemMetrics(): Promise<AdminActionResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/admin/metrics`)
      
      if (response.success !== false) {
        return {
          success: true,
          data: response
        }
      }
      
      return {
        success: false,
        error: (response as any).error || (response as any).message || 'Error al obtener métricas'
      }
    } catch (error: any) {
      console.error('Error fetching system metrics:', error)
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Funcionalidad de métricas no implementada en el backend'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener métricas'
      }
    }
  }

  /**
   * 🔐 Verificar si el usuario actual es administrador
   */
  async checkAdminPermissions(): Promise<AdminActionResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/me`)
      
      if (response.success !== false && (response as any).role) {
        const isAdmin = (response as any).role === 'admin'
        
        return {
          success: true,
          data: {
            isAdmin,
            role: (response as any).role,
            user: response
          }
        }
      }
      
      return {
        success: false,
        error: 'No se pudo verificar los permisos de administrador'
      }
    } catch (error: any) {
      console.error('Error checking admin permissions:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al verificar permisos'
      }
    }
  }
}

export const adminService = new AdminService()
