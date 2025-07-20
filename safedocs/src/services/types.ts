// Tipos compartidos para los servicios
export interface Document {
  id: string
  owner_id: string
  title: string
  description: string | null
  doc_type: string | null
  tags: string[]
  mime_type: string
  file_size: number
  file_path: string
  checksum_sha256: string
  created_at: string
  updated_at: string
}

export interface HistoryEntry {
  id: number
  action: "upload" | "download" | "share" | "verify" | "view" | "delete"
  document_id: string | null
  user_id: string | null
  details: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
  name: string
  created_at: string
  updated_at: string
}

export interface CreateDocumentData {
  title: string
  description?: string
  doc_type?: string
  tags?: string[]
  mime_type: string
  file_size: number
  file_data?: string // Base64 o URL
}

export interface UpdateDocumentData {
  title?: string
  description?: string
  doc_type?: string
  tags?: string[]
}

export interface CreateHistoryData {
  action: HistoryEntry['action']
  document_id?: string
  details?: string
  ip_address?: string
  user_agent?: string
}

// Interfaces para los servicios
export interface IDocumentService {
  getAll(userId: string): Promise<Document[]>
  getById(id: string, userId: string): Promise<Document | null>
  create(data: CreateDocumentData, userId: string): Promise<Document>
  update(id: string, data: UpdateDocumentData, userId: string): Promise<Document>
  delete(id: string, userId: string): Promise<boolean>
}

export interface IHistoryService {
  getAll(userId: string): Promise<HistoryEntry[]>
  create(data: CreateHistoryData, userId: string): Promise<HistoryEntry>
  getByDocumentId(documentId: string, userId: string): Promise<HistoryEntry[]>
}

export interface IUserService {
  getCurrentUser(token: string): Promise<User | null>
  updateProfile(userId: string, data: Partial<User>): Promise<User>
}
