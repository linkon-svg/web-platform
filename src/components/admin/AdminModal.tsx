'use client';

import { ReactNode, useEffect } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: AdminModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-admin-card rounded-xl shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-lg font-semibold text-admin-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-admin-text-secondary hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">{children}</div>

        {/* Footer / Actions */}
        {actions && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-admin-border">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
