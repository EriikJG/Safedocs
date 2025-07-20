export interface VerificationResult {
  id: string
  fileName: string
  status: "verified" | "modified" | "corrupted" | "unknown"
  uploadDate: Date
  lastModified: Date
  hash: string
  size: number
  integrity: number
  details: string[]
  document_id: string
  file_path: string
}

export type VerificationStatus = "verified" | "modified" | "corrupted" | "unknown";
