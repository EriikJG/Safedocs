// Definición del tipo AdminUser para componentes
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

export interface AdminStats {
  totalUsers: number
  adminUsers: number
  activeUsers: number
  inactiveUsers: number
  ownerUsers?: number
  recentlyCreated?: number
}

export interface UseAdminDataReturn {
  users: AdminUser[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateUserRole: (userId: string, newRole: string) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  stats: AdminStats
}
