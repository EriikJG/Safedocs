"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { DashboardTitle } from "@/components/Sliderbar/DashboardTitle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import Loading from "@/components/ui/Loading"
import { UploadDocumentDialog } from "@/modals/UploadDocumentDialog"
import { toast } from "sonner"

import { useHistoryData } from "@/hooks/useHistoryData"
import { Document } from "@/services"
import { documentService } from "@/services/document.service"
import { documentShareService, SharedWithMe } from "@/services/documentShare.service"

// Componentes
import { VerifyDocumentDialog } from "@/components/History/VerifyDocumentDialog"
import { StatsCards } from "@/components/History/StatsCards"
import { DocumentCard } from "@/components/History/DocumentCard"
import { DocumentFilters } from "@/components/History/DocumentFilters"
import { ActivityHistory } from "@/components/History/ActivityHistory"
import { ShareDocumentDialog } from "@/components/History/ShareDocumentDialog"
import { SharedDocumentsCard } from "@/components/History/SharedDocumentsCard"
import { ManageDocumentSharesDialog } from "@/components/History/ManageDocumentSharesDialog"
import { SharedDocumentsList } from "@/components/History/SharedDocumentsList"
import { MySharedDocuments } from "@/components/History/MySharedDocuments"
import { DocumentShareStats } from "@/components/History/DocumentShareStats"

interface EditingDocument {
  title: string
  description: string
  doc_type: string
  tags: string[]
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [editingDoc, setEditingDoc] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<EditingDocument>({
    title: "",
    description: "",
    doc_type: "",
    tags: [],
  })
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  
  // Estados para compartir documentos
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null)
  const [sharedDocuments, setSharedDocuments] = useState<SharedWithMe[]>([])
  const [loadingShared, setLoadingShared] = useState(false)
  const [manageSharesOpen, setManageSharesOpen] = useState(false)
  const [documentToManage, setDocumentToManage] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState<"my-docs" | "shared-with-me" | "my-shared">("my-docs")
  
  // Estado para el diálogo de verificación
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    verificationDetails?: {
      documentId: string;
      isValid: boolean;
      message: string;
    };
  } | null>(null)
  const [documentToVerify, setDocumentToVerify] = useState<Document | null>(null)

  // Usar el hook personalizado para manejar los datos
  const {
    documents,
    historyEntries,
    loading: loadingData,
    error,
    refetch: fetchData,
    handleDeleteDocument: deleteDocument,
    handleUpdateDocument,
  } = useHistoryData()

  const documentTypes = [
    "Cédula de Identidad",
    "Pasaporte",
    "Título de Propiedad",
    "Escritura Notarial",
    "Contrato",
    "Certificado",
    "Otro",
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    } else if (user) {
      // Cargar documentos compartidos conmigo
      loadSharedDocuments()
    }
  }, [user, loading, router])

  const loadSharedDocuments = async () => {
    setLoadingShared(true)
    try {
      const shared = await documentShareService.getSharedWithMe()
      setSharedDocuments(shared)
    } catch (error) {
      console.error("Error loading shared documents:", error)
    } finally {
      setLoadingShared(false)
    }
  }

  const handleDeleteDocument = async (documentId: string, documentTitle: string) => {
    try {
      await deleteDocument(documentId, documentTitle)
      alert("Documento eliminado exitosamente")
    } catch (error) {
      console.error("Error deleting document:", error)
      alert(error instanceof Error ? error.message : "Error al eliminar el documento")
    }
  }

  const handleEditDocument = async (documentId: string) => {
    if (!editingData.title.trim()) {
      alert("El título no puede estar vacío")
      return
    }

    try {
      await handleUpdateDocument(documentId, {
        title: editingData.title.trim(),
        description: editingData.description.trim() || undefined,
        doc_type: editingData.doc_type || undefined,
        tags: editingData.tags,
      })

      alert("Documento actualizado exitosamente")
      setEditingDoc(null)
      setEditingData({ title: "", description: "", doc_type: "", tags: [] })
    } catch (error) {
      console.error("Error updating document:", error)
      alert(error instanceof Error ? error.message : "Error al actualizar el documento")
    }
  }

  const startEdit = (doc: Document) => {
    setEditingDoc(doc.id)
    setEditingData({
      title: doc.title,
      description: doc.description || "",
      doc_type: doc.doc_type || "",
      tags: doc.tags || [],
    })
  }

  const cancelEdit = () => {
    setEditingDoc(null)
    setEditingData({ title: "", description: "", doc_type: "", tags: [] })
    setExpandedDoc(null)
  }

  const handleShareDocument = (doc: Document) => {
    setDocumentToShare(doc)
    setShareDialogOpen(true)
  }

  const handleShareDialogClose = () => {
    setShareDialogOpen(false)
    setDocumentToShare(null)
    // Recargar documentos compartidos por si se compartió algo nuevo
    loadSharedDocuments()
  }

  const handleManageShares = (doc: Document) => {
    setDocumentToManage(doc)
    setManageSharesOpen(true)
  }

  const handleVerifyDocument = async (doc: Document) => {
    try {
      setDocumentToVerify(doc);
      const result = await documentService.verifyDocument(doc.id);
      
      if (result.success && result.data) {
        setVerificationResult({
          isVerified: result.data.isValid,
          verificationDetails: {
            documentId: result.data.documentId,
            isValid: result.data.isValid,
            message: result.data.message
          }
        });
        setVerifyDialogOpen(true);
      } else {
        setVerificationResult({
          isVerified: false,
          verificationDetails: {
            documentId: doc.id,
            isValid: false,
            message: result.error || 'Error desconocido en la verificación'
          }
        });
        setVerifyDialogOpen(true);
      }
    } catch (error) {
      console.error('Error al verificar el documento:', error);
      setVerificationResult({
        isVerified: false,
        verificationDetails: {
          documentId: doc.id,
          isValid: false,
          message: 'Error al intentar verificar el documento'
        }
      });
      setVerifyDialogOpen(true);
    }
  }

  const handleViewSharedDocument = async (shareToken: string) => {
    try {
      const sharedDoc = await documentShareService.getSharedDocument(shareToken)
      // Abrir el documento en una nueva ventana
      if (sharedDoc.document.signed_file_url) {
        window.open(sharedDoc.document.signed_file_url, '_blank')
        toast.success("Documento abierto en nueva ventana")
      } else {
        toast.error("No se pudo obtener la URL del documento")
      }
    } catch (error) {
      console.error("Error viewing shared document:", error)
      toast.error("Error al acceder al documento compartido")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return "📄"
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝"
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊"
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📈"
    if (mimeType.includes("image")) return "🖼️"
    if (mimeType.includes("video")) return "🎥"
    if (mimeType.includes("audio")) return "🎵"
    return "📁"
  }

  if (loading || loadingData) return <Loading title="Verificar Documentos" />

  if (!user) {
    return null
  }

  const filteredEntries = historyEntries.filter((entry) => {
    const document = documents.find((doc) => doc.id === entry.document_id)
    const documentTitle = document?.title || "Documento eliminado"
    const details = entry.details || ""

    const matchesSearch =
      documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction

    const matchesDate =
      filterDate === "all" ||
      (() => {
        const entryDate = new Date(entry.created_at)
        const now = new Date()

        switch (filterDate) {
          case "today":
            return entryDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return entryDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return entryDate >= monthAgo
          default:
            return true
        }
      })()

    return matchesSearch && matchesAction && matchesDate
  })

  const actionCounts = historyEntries.reduce(
    (acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-white">
      <DashboardTitle>Historial</DashboardTitle>

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mis Documentos y Actividades</h2>
            <p className="text-gray-600 mt-2">Gestiona y revisa toda tu actividad documental</p>
          </div>
          <UploadDocumentDialog onUploadComplete={fetchData} />
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalActivities={historyEntries.length}
          totalDocuments={documents.length}
          sharedDocuments={actionCounts.share || 0}
          verifications={actionCounts.verify || 0}
        />

        {/* Document Share Stats */}
        <DocumentShareStats className="mb-6" />

        {/* Tabs de navegación */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("my-docs")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "my-docs"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mis Documentos
          </button>
          <button
            onClick={() => setActiveTab("shared-with-me")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "shared-with-me"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Compartidos Conmigo
          </button>
          <button
            onClick={() => setActiveTab("my-shared")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "my-shared"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mis Compartidos
          </button>
        </div>

        {/* Contenido según tab activo */}
        {activeTab === "my-docs" && (
          <Card>
            <CardHeader>
              <CardTitle>Mis Documentos</CardTitle>
              <CardDescription>{documents.length} documentos en total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isExpanded={expandedDoc === doc.id}
                    isEditing={editingDoc === doc.id}
                    editingData={editingData}
                    documentTypes={documentTypes}
                    onToggleExpand={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                    onStartEdit={() => startEdit(doc)}
                    onSaveEdit={() => handleEditDocument(doc.id)}
                    onCancelEdit={cancelEdit}
                    onDelete={() => handleDeleteDocument(doc.id, doc.title)}
                    onShare={() => handleShareDocument(doc)}
                    onManageShares={() => handleManageShares(doc)}
                    onVerify={() => handleVerifyDocument(doc)}
                    setEditingData={setEditingData}
                    formatFileSize={formatFileSize}
                    getMimeTypeIcon={getMimeTypeIcon}
                  />
                ))}

                {documents.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-16 w-16 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No tienes documentos subidos</h3>
                    <p className="text-sm">Sube tu primer documento para comenzar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "shared-with-me" && (
          <SharedDocumentsList />
        )}

        {activeTab === "my-shared" && (
          <MySharedDocuments />
        )}

        {/* Filters */}
        <DocumentFilters
          searchTerm={searchTerm}
          filterAction={filterAction}
          filterDate={filterDate}
          onSearchChange={setSearchTerm}
          onActionChange={setFilterAction}
          onDateChange={setFilterDate}
        />

        {/* Activity History */}
        {/* <ActivityHistory entries={filteredEntries} documents={documents} totalEntries={historyEntries.length} /> */}
      </div>

      {/* Share Document Dialog */}
      {documentToShare && (
        <ShareDocumentDialog
          open={shareDialogOpen}
          onOpenChange={handleShareDialogClose}
          documentId={documentToShare.id}
          documentTitle={documentToShare.title}
        />
      )}

      {/* Manage Document Shares Dialog */}
      {documentToManage && (
        <ManageDocumentSharesDialog
          open={manageSharesOpen}
          onOpenChange={setManageSharesOpen}
          documentId={documentToManage.id}
          documentTitle={documentToManage.title}
        />
      )}

      {/* Verify Document Dialog */}
      {documentToVerify && verificationResult && (
        <VerifyDocumentDialog
          open={verifyDialogOpen}
          onOpenChange={setVerifyDialogOpen}
          verificationResult={verificationResult}
          documentTitle={documentToVerify.title}
        />
      )}
    </div>
  )
}
