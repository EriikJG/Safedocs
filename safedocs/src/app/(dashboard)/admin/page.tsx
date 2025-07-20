"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { DashboardTitle } from "@/components/Sliderbar/DashboardTitle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Crown,
  User,
  Eye,
  FileCheck
} from "lucide-react"
import Loading from "@/components/ui/Loading"
import { useAdminData } from "@/hooks/useAdminData"
import type { AdminUser } from "@/types/admin.types"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ROLES = [
  { value: 'owner', label: 'Usuario Regular', icon: User, color: 'bg-blue-500' },
  { value: 'admin', label: 'Administrador', icon: Crown, color: 'bg-red-500' },
  { value: 'auditor', label: 'Auditor', icon: Shield, color: 'bg-green-500' },
  { value: 'recipient', label: 'Destinatario', icon: Eye, color: 'bg-purple-500' },
]

const ROLE_PERMISSIONS = {
  owner: ['document:read', 'document:write', 'document:share'],
  admin: ['document:read', 'document:write', 'document:share', 'user:manage', 'system:admin'],
  auditor: ['document:read', 'document:audit', 'system:audit'],
  recipient: ['document:read', 'document:receive']
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const {
    users,
    loading: loadingData,
    error,
    refetch: fetchData,
    updateUserRole,
    deleteUser,
    stats
  } = useAdminData()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Verificar si el usuario actual es admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push("/overview")
    }
  }, [user, router])

  if (loading || loadingData) return <Loading title="Panel de Administración" />

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="mx-auto h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Acceso Denegado</h3>
        <p className="text-muted-foreground">No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      alert(`Rol actualizado exitosamente`)
    } catch (error) {
      console.error("Error updating user role:", error)
      alert(error instanceof Error ? error.message : "Error al actualizar el rol")
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el usuario ${userEmail}?`)) {
      return
    }

    try {
      await deleteUser(userId)
      alert("Usuario eliminado exitosamente")
      // Refrescar la lista de usuarios
      await fetchData()
    } catch (error) {
      console.error("Error deleting user:", error)
      // Mostrar el mensaje de error más específico
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar el usuario"
      alert(`Error: ${errorMessage}`)
    }
  }

  const filteredUsers = users.filter((userItem: AdminUser) => {
    const matchesSearch = 
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.username?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || userItem.role === filterRole
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && userItem.email_confirmed) ||
      (filterStatus === "inactive" && !userItem.email_confirmed)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardTitle>Panel de Administración</DashboardTitle>

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
            <p className="text-gray-600 mt-2">Administra los usuarios y sus permisos en el sistema</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                usuarios registrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                usuarios con permisos admin
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                emails confirmados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auditores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'auditor').length}
              </div>
              <p className="text-xs text-muted-foreground">
                usuarios auditores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuarios encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userItem: AdminUser) => {
                  const roleInfo = getRoleInfo(userItem.role)
                  const RoleIcon = roleInfo.icon
                  
                  return (
                    <TableRow key={userItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${roleInfo.color} text-white`}>
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{userItem.name || userItem.username}</div>
                            <div className="text-sm text-muted-foreground">
                              @{userItem.username || userItem.email.split('@')[0]}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>{userItem.email}</TableCell>
                      
                      <TableCell>
                        <Badge variant={
                          userItem.role === 'admin' ? 'destructive' : 
                          userItem.role === 'auditor' ? 'secondary' :
                          userItem.role === 'recipient' ? 'outline' : 'default'
                        }>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={userItem.email_confirmed ? 'default' : 'secondary'}>
                          {userItem.email_confirmed ? 'Activo' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {formatDate(userItem.created_at)}
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {ROLES.map((role) => {
                              if (role.value === userItem.role) return null; // No mostrar el rol actual
                              return (
                                <DropdownMenuItem 
                                  key={role.value}
                                  onClick={() => handleRoleChange(userItem.id, role.value)}
                                >
                                  <role.icon className="h-4 w-4 mr-2" />
                                  Cambiar a {role.label}
                                </DropdownMenuItem>
                              );
                            })}
                            
                            {userItem.id !== user.id && (
                              <>
                                <DropdownMenuItem 
                                  className="text-red-600 border-t mt-1 pt-1"
                                  onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar Usuario
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
                <p className="text-sm">Ajusta los filtros para ver más resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
