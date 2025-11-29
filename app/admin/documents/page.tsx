"use client";

import { useEffect, useState } from "react";
import { listDocuments, deleteDocument } from "@/lib/api";
import type { DocumentMetadata } from "@/lib/DocumentTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { FileIcon, FileJson2Icon, FileTextIcon, FileType2Icon, Trash2 } from "lucide-react";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadDocs() {
    try {
      setLoading(true);
      const docsRaw = await listDocuments();
      const docsArray: DocumentMetadata[] = docsRaw ? Object.values(docsRaw) : [];
      setDocuments(docsArray);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);
      await loadDocs();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  }

  function getFileIcon(type: string) {
    if (type.includes("pdf")) return <FileType2Icon className="h-5 w-5 text-red-600" />;
    if (type.includes("json")) return <FileJson2Icon className="h-5 w-5 text-yellow-600" />;
    if (type.includes("text")) return <FileTextIcon className="h-5 w-5 text-blue-600" />;
    return <FileIcon className="h-5 w-5 text-gray-600" />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Knowledge Base Documents</h1>

      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-3">Upload Document</h2>
        <FileUploader onUploaded={loadDocs} />
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Documents</h2>
          <span className="text-xs text-muted-foreground">
            {documents.length} file(s)
          </span>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between border rounded-lg p-3 bg-gray-50 hover:bg-white transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(doc.contentType)}

                <div className="flex flex-col">
                  <span className="font-medium text-sm">{doc.filename}</span>
                  <span className="text-xs text-muted-foreground">
                    {doc.contentType} • chunks {doc.chunkCount}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(doc.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          ))}

          {documents.length === 0 && !loading && (
            <div className="text-xs text-muted-foreground text-center py-6">
              No documents found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
