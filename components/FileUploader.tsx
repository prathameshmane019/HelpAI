"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadDocument } from "@/lib/api";
import type { DocumentMetadata } from "@/lib/DocumentTypes";
import { Upload, FileIcon } from "lucide-react";

interface FileUploaderProps {
  onUploaded?: () => void;
}

export default function FileUploader({ onUploaded }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      await uploadDocument(file);
      setFile(null);
      onUploaded?.();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label
        className="border-2 border-dashed rounded-md p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition"
      >
        <Upload className="h-6 w-6 text-gray-500" />
        <span className="text-sm text-gray-600">
          {file ? file.name : "Choose or drop a file"}
        </span>

        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <div className="text-xs flex items-center gap-2 bg-gray-100 p-2 rounded">
          <FileIcon className="h-4 w-4" />
          {file.name}
        </div>
      )}

      <Button disabled={!file || uploading} onClick={handleUpload}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
