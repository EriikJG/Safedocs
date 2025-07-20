// 📊 Configuración para el cálculo de estadísticas del dashboard
import { Document } from "@/services/types"

/**
 * Configuración de criterios para calcular estadísticas
 * Ajusta estos valores según tu lógica de negocio
 */
export const STATS_CONFIG = {
  // Criterios para considerar un documento como "compartido"
  SHARED_CRITERIA: {
    // Tags que indican que un documento es compartido
    SHARED_TAGS: ['compartido', 'shared', 'publico', 'public'],
    // Tipos de documento que son considerados compartidos por defecto
    SHARED_DOC_TYPES: ['Documento Público', 'Certificado', 'Acta'],
    // Función personalizada para determinar si un documento es compartido
    customCheck: (doc: Document): boolean => {
      // Ejemplo: documentos con ciertos prefijos en el título
      return doc.title.toLowerCase().includes('[público]') ||
             doc.title.toLowerCase().includes('[compartido]')
    }
  },
  
  // Criterios para considerar un documento como "verificado"
  VERIFIED_CRITERIA: {
    // Un documento está verificado si tiene checksum
    hasChecksum: true,
    // Tags que indican verificación
    VERIFIED_TAGS: ['verificado', 'verified', 'validado'],
    // Tipos de documento que requieren verificación
    REQUIRES_VERIFICATION: ['Escritura Notarial', 'Contrato', 'Certificado'],
    // Función personalizada para determinar si un documento está verificado
    customCheck: (doc: Document): boolean => {
      // Ejemplo: documentos con checksum válido y ciertos tipos
      return !!(doc.checksum_sha256 && doc.checksum_sha256.length > 0)
    }
  },
  
  // Configuración temporal para funcionalidades no implementadas
  TEMP_VALUES: {
    authorizedUsers: 5, // Valor fijo hasta implementar
    defaultSharedPercentage: 0.3, // 30% si no se puede calcular
    defaultVerifiedPercentage: 0.7 // 70% si no se puede calcular
  }
}

/**
 * Función para determinar si un documento es compartido
 */
export const isSharedDocument = (doc: Document): boolean => {
  const { SHARED_CRITERIA } = STATS_CONFIG
  
  // Verificar por tags
  const hasSharedTag = doc.tags.some(tag => 
    SHARED_CRITERIA.SHARED_TAGS.some(sharedTag => 
      tag.toLowerCase().includes(sharedTag.toLowerCase())
    )
  )
  
  // Verificar por tipo de documento
  const hasSharedType = doc.doc_type && 
    SHARED_CRITERIA.SHARED_DOC_TYPES.includes(doc.doc_type)
  
  // Verificar criterio personalizado
  const meetsCustomCriteria = SHARED_CRITERIA.customCheck(doc)
  
  return hasSharedTag || hasSharedType || meetsCustomCriteria
}

/**
 * Función para determinar si un documento está verificado
 */
export const isVerifiedDocument = (doc: Document): boolean => {
  const { VERIFIED_CRITERIA } = STATS_CONFIG
  
  // Verificar por checksum
  const hasValidChecksum = VERIFIED_CRITERIA.hasChecksum && 
    doc.checksum_sha256 && doc.checksum_sha256.length > 0
  
  // Verificar por tags
  const hasVerifiedTag = doc.tags.some(tag => 
    VERIFIED_CRITERIA.VERIFIED_TAGS.some(verifiedTag => 
      tag.toLowerCase().includes(verifiedTag.toLowerCase())
    )
  )
  
  // Verificar criterio personalizado
  const meetsCustomCriteria = VERIFIED_CRITERIA.customCheck(doc)
  
  return hasValidChecksum || hasVerifiedTag || meetsCustomCriteria
}

/**
 * Función principal para calcular estadísticas
 */
export const calculateDocumentStats = (documents: Document[]) => {
  const totalDocuments = documents.length
  
  // Calcular documentos compartidos
  const sharedDocuments = documents.filter(isSharedDocument).length
  
  // Calcular documentos verificados
  const verifiedDocuments = documents.filter(isVerifiedDocument).length
  
  return {
    documentCount: totalDocuments,
    sharedCount: sharedDocuments,
    verifiedCount: verifiedDocuments,
    authorizedUsers: STATS_CONFIG.TEMP_VALUES.authorizedUsers
  }
}
