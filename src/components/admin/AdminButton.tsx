'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'danger' | 'secondary' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-admin-primary text-white hover:bg-admin-primary-hover focus:ring-admin-primary/40',
  danger:
    'bg-admin-danger text-white hover:bg-red-600 focus:ring-admin-danger/40',
  secondary:
    'bg-gray-100 text-admin-text hover:bg-gray-200 focus:ring-gray-300/40',
  success:
    'bg-admin-success text-white hover:bg-green-600 focus:ring-admin-success/40',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[32px]',
  md: 'px-4 py-2 text-sm min-h-[40px]',
  lg: 'px-6 py-2.5 text-base min-h-[44px]',
};

export default function AdminButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: AdminButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
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
      )}
      {children}
    </button>
  );
}
