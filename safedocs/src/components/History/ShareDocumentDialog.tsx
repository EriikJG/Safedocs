"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share2, Calendar, User, Search, Clock, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  documentShareService, 
  UserForSharing, 
  CreateSimpleShare 
} from "@/services/documentShare.service";

interface ShareDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
}

export function ShareDocumentDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: ShareDocumentDialogProps) {
  // Estados del formulario
  const [formData, setFormData] = useState<CreateSimpleShare>({
    documentId: "",
    sharedWithUserId: "",
    permissionLevel: "read",
    expiresInHours: 24,
    shareTitle: "",
    shareMessage: "",
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserForSharing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [shareToken, setShareToken] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserForSharing | null>(null);

  // Inicializar datos del formulario al abrir el diálogo
  useEffect(() => {
    if (open) {
      setFormData({
        documentId: documentId,
        sharedWithUserId: "",
        permissionLevel: "read",
        expiresInHours: 24,
        shareTitle: `${documentTitle} - Documento compartido`,
        shareMessage: `Te comparto este documento: ${documentTitle}`,
      });
    } else {
      // Reset form cuando se cierra el diálogo
      resetForm();
    }
  }, [open, documentId, documentTitle]);

  // Búsqueda de usuarios con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Reinicia el formulario
   */
  const resetForm = () => {
    setStep("form");
    setFormData({
      documentId: "",
      sharedWithUserId: "",
      permissionLevel: "read",
      expiresInHours: 24,
      shareTitle: "",
      shareMessage: "",
    });
    setSearchQuery("");
    setUsers([]);
    setShareToken("");
    setSelectedUser(null);
  };

  /**
   * Busca usuarios disponibles para compartir
   */
  const searchUsers = async () => {
    if (searchQuery.length < 3) return;
    
    setSearchLoading(true);
    try {
      const result = await documentShareService.searchUsersForSharing(searchQuery);
      setUsers(result.users || []);
      if (result.message && result.users.length === 0) {
        toast.info(result.message);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Error al buscar usuarios");
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * Maneja el envío del formulario de compartir
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sharedWithUserId) {
      toast.error("Debes seleccionar un usuario");
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando datos para compartir:', formData);
      const result = await documentShareService.shareDocument(formData);
      console.log('Resultado del servicio:', result);
      
      // Verificar si la respuesta es exitosa
      if (result && (result.success === true || result.success === undefined)) {
        setShareToken(result.share_token || '');
        setStep("success");
        toast.success("Documento compartido exitosamente");
      } else {
        console.error('Error en respuesta:', result);
        toast.error(result?.message || "Error al compartir el documento");
      }
    } catch (error) {
      console.error("Error sharing document:", error);
      toast.error(error instanceof Error ? error.message : "Error al compartir el documento");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copia el token de compartir al portapapeles
   */
  const copyShareToken = async () => {
    try {
      await navigator.clipboard.writeText(shareToken);
      toast.success("Token copiado al portapapeles");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Error al copiar el token");
    }
  };

  /**
   * Selecciona un usuario de la lista de búsqueda
   */
  const selectUser = (user: UserForSharing) => {
    setFormData(prev => ({
      ...prev,
      sharedWithUserId: user.id
    }));
    setSelectedUser(user);
    setSearchQuery("");
    setUsers([]);
  };

  /**
   * Actualiza un campo del formulario
   */
  const updateFormField = (field: keyof CreateSimpleShare, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Cierra el diálogo
   */
  const handleClose = () => {
    onOpenChange(false);
  };

  /**
   * Renderiza el paso de éxito
   */
  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Documento compartido exitosamente
          </CardTitle>
          <CardDescription>
            El documento ha sido compartido con {selectedUser?.name || "el usuario seleccionado"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Token de compartir</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={shareToken}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyShareToken}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Comparte este token con el usuario para que pueda acceder al documento
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-xs text-muted-foreground">Permisos</Label>
              <p className="text-sm font-medium capitalize">{formData.permissionLevel}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Expira en</Label>
              <p className="text-sm font-medium">{formData.expiresInHours} horas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Renderiza el paso del formulario
   */
  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Búsqueda de usuarios */}
      <div className="space-y-2">
        <Label htmlFor="userSearch">Buscar usuario</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="userSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="pl-10"
          />
        </div>
        
        {/* Lista de usuarios encontrados */}
        {users.length > 0 && (
          <div className="max-h-40 overflow-y-auto border rounded-md">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => selectUser(user)}
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {user.company && (
                    <p className="text-xs text-muted-foreground truncate">{user.company}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchLoading && (
          <p className="text-sm text-muted-foreground">Buscando usuarios...</p>
        )}
      </div>

      {/* Usuario seleccionado */}
      {selectedUser && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                {selectedUser.company && (
                  <p className="text-sm text-muted-foreground">{selectedUser.company}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuración de permisos */}
      <div className="space-y-2">
        <Label htmlFor="permissions">Nivel de permisos</Label>
        <Select
          value={formData.permissionLevel}
          onValueChange={(value: "read" | "comment") => 
            updateFormField("permissionLevel", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el nivel de permisos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="read">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Solo lectura
              </div>
            </SelectItem>
            <SelectItem value="comment">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Descargar
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Configuración de expiración */}
      <div className="space-y-2">
        <Label htmlFor="expiration">Expira en (horas)</Label>
        <Select
          value={formData.expiresInHours.toString()}
          onValueChange={(value) => updateFormField("expiresInHours", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona cuándo expira" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 hora</SelectItem>
            <SelectItem value="6">6 horas</SelectItem>
            <SelectItem value="24">24 horas (1 día)</SelectItem>
            <SelectItem value="48">48 horas (2 días)</SelectItem>
            <SelectItem value="168">168 horas (1 semana)</SelectItem>
            <SelectItem value="720">720 horas (1 mes)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Título personalizado */}
      <div className="space-y-2">
        <Label htmlFor="shareTitle">Título personalizado (opcional)</Label>
        <Input
          id="shareTitle"
          value={formData.shareTitle}
          onChange={(e) => updateFormField("shareTitle", e.target.value)}
          placeholder="Título del documento compartido"
        />
      </div>

      {/* Mensaje personalizado */}
      <div className="space-y-2">
        <Label htmlFor="shareMessage">Mensaje personalizado (opcional)</Label>
        <Textarea
          id="shareMessage"
          value={formData.shareMessage}
          onChange={(e) => updateFormField("shareMessage", e.target.value)}
          placeholder="Mensaje que acompañará al documento compartido"
          rows={3}
        />
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {step === "form" ? "Compartir documento" : "Documento compartido"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" 
              ? `Comparte "${documentTitle}" con otros usuarios`
              : "El documento ha sido compartido exitosamente"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? renderFormStep() : renderSuccessStep()}

        <DialogFooter>
          {step === "form" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.sharedWithUserId}
              >
                {loading ? "Compartiendo..." : "Compartir documento"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
