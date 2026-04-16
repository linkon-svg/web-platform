'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  category: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  category,
  label,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`http://localhost:8000/api/upload/${category}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.url);
      setPreview(null);
    } catch {
      // On error, clear preview
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayImage = preview || value;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-admin-text">
          {label}
        </label>
      )}

      {displayImage ? (
        /* Image preview */
        <div className="relative group rounded-lg overflow-hidden border border-admin-border">
          <img
            src={displayImage}
            alt="업로드 이미지"
            className="w-full h-48 object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <svg
                className="animate-spin h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
          {!uploading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="이미지 삭제"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed
            cursor-pointer transition-colors
            ${
              isDragging
                ? 'border-admin-primary bg-admin-primary/5'
                : 'border-admin-border hover:border-admin-primary/50 hover:bg-admin-bg'
            }
          `}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-admin-text-secondary/50 mb-3"
          >
            <rect x="4" y="6" width="32" height="28" rx="3" />
            <circle cx="14" cy="16" r="3" />
            <path d="M36 28l-8-8-16 16" />
            <path d="M20 18l-4 4" />
          </svg>
          <p className="text-sm text-admin-text-secondary">
            클릭하거나 이미지를 드래그하세요
          </p>
          <p className="text-xs text-admin-text-secondary/60 mt-1">
            JPG, PNG, WebP
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
