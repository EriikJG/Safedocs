export interface UploadMetadata {
  docType: string | undefined;
  title: string;
  description: string;
  tags: string;
}

export interface UploadDocumentDialogProps {
  trigger?: React.ReactNode;
  onUploadComplete?: () => void;
}
