import { useState, useEffect } from "react"
import { documentService } from "@/services/document.service"
import { AuthUser } from "@/services/auth.service"
import { calculateDocumentStats } from "@/lib/stats-calculator"

// Tipos para las estadísticas
interface DocumentStats {
  documentCount: number
  sharedCount: number
  verifiedCount: number
  authorizedUsers: number
}

export function useOverviewStats(user: AuthUser | null) {
  const [stats, setStats] = useState<DocumentStats>({
    documentCount: 0,
    sharedCount: 0,
    verifiedCount: 0,
    authorizedUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
      try {
        // Obtener documentos del usuario con paginación adecuada
        const response = await documentService.getDocuments({}, 1, 100) // Ajusta según necesites
        
        if (response.success && response.data) {
          const documents = response.data.documents
          
          // Calcular estadísticas usando la función centralizada
          const calculatedStats = calculateDocumentStats(documents)
          setStats(calculatedStats)
          
          console.log('📊 Estadísticas calculadas:', {
            total: documents.length,
            stats: calculatedStats,
            documentsSample: documents.slice(0, 2) // Muestra los primeros 2 documentos para debug
          })
        } else {
          console.error('Error fetching documents for stats:', response.error)
          // Mantener valores por defecto
          setStats({
            documentCount: 0,
            sharedCount: 0,
            verifiedCount: 0,
            authorizedUsers: 5
          })
        }
      } catch (error) {
        console.error('Error in fetchStats:', error)
        // Mantener valores por defecto
        setStats({
          documentCount: 0,
          sharedCount: 0,
          verifiedCount: 0,
          authorizedUsers: 5
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  return {
    stats,
    isLoading
  }
}
