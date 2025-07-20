import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { adminService } from '@/services'
import type { AdminUser, AdminStats, UseAdminDataReturn } from '@/types/admin.types'

export const useAdminData = (): UseAdminDataReturn => {
  const { user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    ownerUsers: 0,
    recentlyCreated: 0
  })

  const fetchData = async () => {
    if (!user?.id || user.role !== 'admin') return
    
    try {
      setLoading(true)
      setError(null)

      const response = await adminService.getUsers()
      
      if (response.success) {
        const usersData = response.data || []
        setUsers(usersData)
        
        // Calcular estadísticas
        const totalUsers = usersData.length
        const adminUsers = usersData.filter((u: AdminUser) => u.role === 'admin').length
        const ownerUsers = usersData.filter((u: AdminUser) => u.role === 'owner').length
        const activeUsers = usersData.filter((u: AdminUser) => u.email_confirmed).length
        const inactiveUsers = totalUsers - activeUsers
        
        // Calcular usuarios creados recientemente (última semana)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const recentlyCreated = usersData.filter((u: AdminUser) => {
          const createdAt = new Date(u.created_at)
          return createdAt >= weekAgo
        }).length
        
        setStats({
          totalUsers,
          adminUsers,
          ownerUsers,
          activeUsers,
          inactiveUsers,
          recentlyCreated
        })
      } else {
        setError(response.error || 'Error al obtener usuarios')
        setUsers([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error("Error fetching admin data:", err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!user?.id || user.role !== 'admin') {
      throw new Error("No tienes permisos para esta acción")
    }

    try {
      const response = await adminService.updateUserRole(userId, newRole)
      
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar el rol')
      }

      // Actualizar el usuario en el estado local
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, role: newRole as 'owner' | 'admin' | 'auditor' | 'recipient' } : u
          )
        )      // Recalcular estadísticas
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole as 'owner' | 'admin' | 'auditor' | 'recipient' } : u
      )
      const totalUsers = updatedUsers.length
      const adminUsers = updatedUsers.filter(u => u.role === 'admin').length
      const ownerUsers = updatedUsers.filter(u => u.role === 'owner').length
      const activeUsers = updatedUsers.filter(u => u.email_confirmed).length
      const inactiveUsers = totalUsers - activeUsers
      
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const recentlyCreated = updatedUsers.filter(u => {
        const createdAt = new Date(u.created_at)
        return createdAt >= weekAgo
      }).length
      
      setStats({
        totalUsers,
        adminUsers,
        ownerUsers,
        activeUsers,
        inactiveUsers,
        recentlyCreated
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      throw new Error(`Error al actualizar el rol: ${errorMessage}`)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!user?.id || user.role !== 'admin') {
      throw new Error("No tienes permisos para esta acción")
    }

    if (userId === user.id) {
      throw new Error("No puedes eliminarte a ti mismo")
    }

    try {
      const response = await adminService.deleteUser(userId)
      
      // Manejo más robusto de la respuesta
      if (response.success === false) {
        throw new Error(response.error || 'Error al eliminar el usuario')
      }

      // Si llegamos aquí, asumimos que la eliminación fue exitosa
      // Eliminar usuario del estado local
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId))

      // Recalcular estadísticas con el estado actualizado
      setUsers(currentUsers => {
        const updatedUsers = currentUsers.filter(u => u.id !== userId)
        const totalUsers = updatedUsers.length
        const adminUsers = updatedUsers.filter(u => u.role === 'admin').length
        const ownerUsers = updatedUsers.filter(u => u.role === 'owner').length
        const activeUsers = updatedUsers.filter(u => u.email_confirmed).length
        const inactiveUsers = totalUsers - activeUsers
        
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const recentlyCreated = updatedUsers.filter(u => {
          const createdAt = new Date(u.created_at)
          return createdAt >= weekAgo
        }).length
        
        setStats({
          totalUsers,
          adminUsers,
          ownerUsers,
          activeUsers,
          inactiveUsers,
          recentlyCreated
        })

        return updatedUsers
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error("Error deleting user:", err)
      throw new Error(`Error al eliminar el usuario: ${errorMessage}`)
    }
  }

  useEffect(() => {
    if (user?.id && user.role === 'admin') {
      fetchData()
    }
  }, [user?.id, user?.role])

  return {
    users,
    loading,
    error,
    refetch: fetchData,
    updateUserRole,
    deleteUser,
    stats
  }
}
