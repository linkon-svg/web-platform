'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { API_BASE } from '@/lib/api';
import { AdminCard, AdminButton } from '@/components/admin';

interface HeroImage {
  url: string;
  filename: string;
}

export default function AdminHeroPage() {
  const { token } = useAuth();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/upload/hero`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '히어로 이미지 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchImages();
  }, [token]);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드 가능합니다.' });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/api/upload/hero`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
      fetchImages();
    } catch {
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url: url }),
      });
      if (!res.ok) throw new Error('Delete failed');
      setMessage({ type: 'success', text: '이미지가 삭제되었습니다.' });
      fetchImages();
    } catch {
      setMessage({ type: 'error', text: '이미지 삭제에 실패했습니다.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-admin-text-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <AdminCard title="이미지 업로드">
        <div
          role="button"
          tabIndex={0}
          aria-label="히어로 이미지 업로드 영역"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
          className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary/50 hover:bg-admin-bg cursor-pointer transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-8 w-8 text-admin-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-admin-text-secondary">업로드 중...</p>
            </div>
          ) : (
            <>
              <svg
                width="40" height="40" viewBox="0 0 40 40" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-admin-text-secondary/50 mb-3"
              >
                <rect x="4" y="6" width="32" height="28" rx="3" />
                <circle cx="14" cy="16" r="3" />
                <path d="M36 28l-8-8-16 16" />
                <path d="M20 18l-4 4" />
              </svg>
              <p className="text-sm text-admin-text-secondary">클릭하거나 이미지를 드래그하세요</p>
              <p className="text-xs text-admin-text-secondary/60 mt-1">권장 크기: 1920x600 이상. JPG, PNG, WebP</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </AdminCard>

      <AdminCard title={`히어로 이미지 목록 (${images.length})`}>
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-admin-text-secondary">
            등록된 히어로 이미지가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.url} className="relative group rounded-lg overflow-hidden border border-admin-border">
                <img
                  src={img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`}
                  alt={img.filename}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs text-white truncate">{img.filename}</p>
                </div>
                <button
                  onClick={() => handleDelete(img.url)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="이미지 삭제"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
