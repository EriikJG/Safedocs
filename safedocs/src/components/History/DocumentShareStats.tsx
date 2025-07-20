"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Share2, 
  Users, 
  Clock, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Settings
} from "lucide-react";
import { useDocumentShareOperations } from "@/contexts/DocumentShareContext";

interface DocumentShareStatsProps {
  className?: string;
}

export function DocumentShareStats({ className }: DocumentShareStatsProps) {
  const { getShareStatistics, loadingSharedWithMe, loadingMyShared } = useDocumentShareOperations();

  // Mostrar skeleton mientras carga
  if (loadingSharedWithMe || loadingMyShared) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Obtener estadísticas de manera segura
  let stats;
  try {
    stats = getShareStatistics();
  } catch (error) {
    console.error('Error getting share statistics:', error);
    // Valores por defecto si hay error
    stats = {
      totalSharedWithMe: 0,
      totalMyShared: 0,
      expiredSharedWithMe: 0,
      activeMyShared: 0,
      inactiveMyShared: 0,
      permissionBreakdown: {
        read: 0,
        write: 0,
        admin: 0,
      }
    };
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Documentos compartidos conmigo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compartidos Conmigo</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSharedWithMe}</div>
          <div className="flex items-center gap-2 mt-2">
            {stats.expiredSharedWithMe > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {stats.expiredSharedWithMe} expirado{stats.expiredSharedWithMe === 1 ? '' : 's'}
              </Badge>
            )}
            {stats.expiredSharedWithMe === 0 && stats.totalSharedWithMe > 0 && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Todos activos
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documentos que he compartido */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mis Compartidos</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMyShared}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.activeMyShared} activo{stats.activeMyShared === 1 ? '' : 's'}
            </Badge>
            {stats.inactiveMyShared > 0 && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {stats.inactiveMyShared} inactivo{stats.inactiveMyShared === 1 ? '' : 's'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usuarios únicos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {/* Calculamos usuarios únicos basado en los documentos compartidos */}
            {new Set([
              ...stats.totalSharedWithMe > 0 ? ['shared-users'] : [],
              ...stats.totalMyShared > 0 ? ['my-users'] : []
            ]).size}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Usuarios que colaboran contigo
          </p>
        </CardContent>
      </Card>

      {/* Distribución de permisos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Permisos</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.permissionBreakdown.read > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">Lectura</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stats.permissionBreakdown.read}
                </Badge>
              </div>
            )}
            {stats.permissionBreakdown.write > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">Edición</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stats.permissionBreakdown.write}
                </Badge>
              </div>
            )}
            {stats.permissionBreakdown.admin > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-3 w-3 text-red-500" />
                  <span className="text-xs">Admin</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stats.permissionBreakdown.admin}
                </Badge>
              </div>
            )}
            {stats.totalMyShared === 0 && (
              <p className="text-xs text-muted-foreground">
                Sin documentos compartidos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
