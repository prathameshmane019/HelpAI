// lib/DocumentTypes.ts

export interface DocumentMetadata {
  id: string;
  filename: string;
  contentType: string;
  uploadedAt: number;  // epoch millis from backend
  chunkCount: number;
}
