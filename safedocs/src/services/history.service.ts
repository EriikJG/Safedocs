// 📊 Servicio de historial - Integración completa con backend NestJS
import { API_CONFIG, buildApiUrl } from '@/config/api'
import { apiClient } from '@/lib/api-client'
import { HistoryEntry, CreateHistoryData } from './types'

export interface HistoryResponse {
  success: boolean
  data: {
    entries: HistoryEntry[]
    total: number
    page: number
    limit: number
  }
  error?: string
}

export interface HistoryEntryResponse {
  success: boolean
  data: HistoryEntry
  error?: string
}

export interface IHistoryService {
  getHistory(userId?: string, page?: number, limit?: number): Promise<HistoryResponse>
  create(data: CreateHistoryData): Promise<HistoryEntryResponse>
  getEntry(id: string): Promise<HistoryEntryResponse>
}

class HistoryService implements IHistoryService {
  private readonly baseURL = buildApiUrl(API_CONFIG.backend.endpoints.history)

  /**
   * 📊 Obtener historial de actividades
   */
  async getHistory(userId?: string, page = 1, limit = 20): Promise<HistoryResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (userId) {
        params.append('userId', userId)
      }

      const response = await apiClient.get(`${this.baseURL}?${params}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching history:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener historial')
    }
  }

  /**
   * ✏️ Crear nueva entrada en el historial
   */
  async create(data: CreateHistoryData): Promise<HistoryEntryResponse> {
    try {
      const response = await apiClient.post(this.baseURL, data)
      return response.data
    } catch (error: any) {
      console.error('Error creating history entry:', error)
      throw new Error(error.response?.data?.message || 'Error al crear entrada de historial')
    }
  }

  /**
   * 📄 Obtener entrada específica del historial
   */
  async getEntry(id: string): Promise<HistoryEntryResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching history entry:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener entrada de historial')
    }
  }
}

export const historyService = new HistoryService()
