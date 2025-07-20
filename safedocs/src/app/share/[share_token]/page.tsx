"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Shield, 
  ExternalLink,
  ArrowLeft 
} from "lucide-react";
import { documentShareService, SharedDocument } from "@/services/documentShare.service";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

export default function SharedDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const shareToken = params.token as string;
  
  const [sharedDoc, setSharedDoc] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shareToken) {
      loadSharedDocument();
    }
  }, [shareToken]);

  const loadSharedDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const document = await documentShareService.getSharedDocument(shareToken);
      setSharedDoc(document);
    } catch (error) {
      console.error("Error loading shared document:", error);
      setError(error instanceof Error ? error.message : "Error al cargar el documento");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = () => {
    if (sharedDoc?.document.signed_file_url) {
      window.open(sharedDoc.document.signed_file_url, '_blank');
      toast.success("Documento abierto en nueva ventana");
    } else {
      toast.error("No se pudo obtener la URL del documento");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'documento':
      case 'doc':
      case 'docx':
        return '📝';
      case 'imagen':
      case 'image':
        return '🖼️';
      case 'excel':
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Tamaño desconocido";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return <Loading title="Cargando Documento Compartido" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Shield className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• El enlace puede haber expirado</p>
              <p>• Es posible que no tengas permisos</p>
              <p>• Verifica que el enlace esté completo</p>
            </div>
            <Button 
              onClick={() => router.push('/login')} 
              className="mt-4"
            >
              Ir al Inicio de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sharedDoc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Documento No Encontrado
            </h2>
            <p className="text-gray-600">
              El documento compartido no existe o ya no está disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = sharedDoc.share.expires_at
    ? new Date(sharedDoc.share.expires_at) < new Date()
    : false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Documento Compartido
              </h1>
              <p className="text-sm text-gray-500">
                Acceso de solo lectura
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Document Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {getFileIcon(sharedDoc.document.tipo)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {sharedDoc.document.titulo}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {sharedDoc.share.title || "Documento compartido"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {isExpired ? (
                    <Badge variant="destructive">
                      Expirado
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  )}
                  <Badge variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Solo lectura
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mensaje del compartir */}
              {sharedDoc.share.message && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Mensaje:</strong> {sharedDoc.share.message}
                  </p>
                </div>
              )}

              {/* Descripción del documento */}
              {sharedDoc.document.contenido && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-gray-600">{sharedDoc.document.contenido}</p>
                </div>
              )}

              {/* Metadatos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span>Tipo: {sharedDoc.document.tipo}</span>
                  </div>
                  {sharedDoc.document.file_size && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText className="h-4 w-4" />
                      <span>Tamaño: {formatFileSize(sharedDoc.document.file_size)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Compartido: {formatDate(sharedDoc.share.created_at)}</span>
                  </div>
                  {sharedDoc.share.expires_at && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Expira: {formatDate(sharedDoc.share.expires_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button 
                  onClick={handleViewDocument}
                  disabled={isExpired || !sharedDoc.document.signed_file_url}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Documento
                </Button>
                
                {sharedDoc.share.permission_level === 'read' && (
                  <Button 
                    variant="outline"
                    onClick={handleViewDocument}
                    disabled={isExpired || !sharedDoc.document.signed_file_url}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Acceso Seguro
                  </p>
                  <p>
                    Este documento ha sido compartido de forma segura. 
                    Solo tienes acceso de lectura y el enlace puede expirar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
