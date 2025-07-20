"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  User, 
  Calendar, 
  Trash2, 
  Eye,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { documentShareService } from "@/services/documentShare.service";

interface SharedUser {
  shareId: string;
  userId: string;
  name: string;
  company?: string;
  avatar?: string;
  permission: 'read' | 'comment';
  expiresAt?: string;
  sharedAt: string;
}

interface ManageDocumentSharesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
}

export function ManageDocumentSharesDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: ManageDocumentSharesDialogProps) {
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (open && documentId) {
      loadSharedUsers();
    }
  }, [open, documentId]);

  const loadSharedUsers = async () => {
    setLoading(true);
    try {
      const result = await documentShareService.getDocumentSharedUsers(documentId);
      setSharedUsers(result.users || []);
    } catch (error) {
      console.error("Error loading shared users:", error);
      toast.error("Error al cargar usuarios compartidos");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (shareId: string, userName: string) => {
    if (!confirm(`¿Revocar acceso a ${userName}?`)) return;

    setRevoking(shareId);
    try {
      await documentShareService.revokeShare(shareId);
      toast.success(`Acceso revocado para ${userName}`);
      // Recargar la lista
      loadSharedUsers();
    } catch (error) {
      console.error("Error revoking access:", error);
      toast.error("Error al revocar acceso");
    } finally {
      setRevoking(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios con Acceso
          </DialogTitle>
          <DialogDescription>
            Gestiona quién tiene acceso a &quot;{documentTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Cargando usuarios...</p>
            </div>
          ) : sharedUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No has compartido este documento con nadie aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sharedUsers.map((user) => {
                const expired = isExpired(user.expiresAt);
                
                return (
                  <div
                    key={user.shareId}
                    className={`p-4 border rounded-lg ${
                      expired ? 'bg-red-50 border-red-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <Badge 
                              variant={expired ? "destructive" : "default"}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {user.permission === 'read' ? 'Solo lectura' : 'Comentarios'}
                            </Badge>
                            {expired && (
                              <Badge variant="destructive" className="text-xs">
                                Expirado
                              </Badge>
                            )}
                          </div>
                          
                          {user.company && (
                            <p className="text-sm text-gray-600 mb-2">{user.company}</p>
                          )}
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Compartido: {formatDate(user.sharedAt)}</span>
                            </div>
                            {user.expiresAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {expired ? 'Expiró' : 'Expira'}: {formatDate(user.expiresAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeAccess(user.shareId, user.name)}
                        disabled={revoking === user.shareId}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {revoking === user.shareId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Revocar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
