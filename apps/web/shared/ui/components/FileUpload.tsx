'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  required?: boolean;
  maxSizeMB?: number;
  accept?: string;
  height?: string;
}

export function FileUpload({
  onUpload,
  currentUrl,
  label,
  required,
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png',
  height = 'h-56',
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be under ${maxSizeMB}MB`);
      return;
    }

    const acceptedTypes = accept.split(',').map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError(`Only ${acceptedTypes.map((t) => t.replace('image/', '').toUpperCase()).join(' and ')} files are accepted`);
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiBase}/uploads/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setPreview(result.url);
      onUpload(result.url);
    } catch {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`mt-1 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          preview
            ? 'border-border overflow-hidden'
            : 'border-border bg-muted/10 hover:border-primary/50 hover:bg-muted/20'
        } ${uploading ? 'pointer-events-none opacity-60' : ''} ${height}`}
      >
        {preview ? (
          <div className="relative h-full w-full">
            <Image src={preview} alt="Upload preview" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium text-white">Click to change</span>
            </div>
          </div>
        ) : uploading ? (
          <Loader2 className="mb-2 h-8 w-8 text-orange-500 animate-spin" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Click to upload photo</span>
            <span className="mt-1 text-xs text-muted-foreground">
              PNG, JPG up to {maxSizeMB}MB
            </span>
          </>
        )}
      </button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
