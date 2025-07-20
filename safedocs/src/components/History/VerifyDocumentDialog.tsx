"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileCheck, FileX, CheckCircle2, XCircle } from "lucide-react"

interface VerifyDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  verificationResult: {
    isVerified: boolean
    verificationDetails?: {
      documentId: string
      isValid: boolean
      message: string
    }
  } | null
  documentTitle: string
}

export function VerifyDocumentDialog({
  open,
  onOpenChange,
  verificationResult,
  documentTitle,
}: VerifyDocumentDialogProps) {
  if (!verificationResult) return null

  const { isVerified, verificationDetails } = verificationResult

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isVerified ? (
              <>
                <FileCheck className="h-6 w-6 text-green-500" />
                <span>Documento Verificado</span>
              </>
            ) : (
              <>
                <FileX className="h-6 w-6 text-red-500" />
                <span>Documento No Verificado</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Resultados de la verificación para &quot;{documentTitle}&quot;
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className={`p-4 rounded-lg ${
            isVerified ? "bg-green-50" : "bg-red-50"
          }`}>
            <div className="flex items-start gap-3">
              {isVerified ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <h4 className={`font-medium ${
                  isVerified ? "text-green-800" : "text-red-800"
                }`}>
                  {isVerified ? "Verificación Exitosa" : "Verificación Fallida"}
                </h4>
                <p className={`text-sm ${
                  isVerified ? "text-green-700" : "text-red-700"
                }`}>
                  {verificationDetails?.message || 
                    (isVerified 
                      ? "El documento ha sido verificado correctamente."
                      : "No se pudo verificar la autenticidad del documento."
                    )
                  }
                </p>
              </div>
            </div>
          </div>

          {verificationDetails && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ID del documento:</span>
                <span className="font-medium">{verificationDetails.documentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estado:</span>
                <span className="font-medium">
                  {verificationDetails.isValid ? "Verificado" : "No verificado"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fecha de verificación:</span>
                <span className="font-medium">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
