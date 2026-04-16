'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    'bg-hospital-gold text-white hover:bg-hospital-gold-dark active:bg-hospital-gold-dark/90 shadow-sm',
  secondary:
    'bg-hospital-brown text-white hover:bg-hospital-brown-light active:bg-hospital-brown-light/90 shadow-sm',
  outline:
    'bg-transparent border border-hospital-gold text-hospital-gold hover:bg-hospital-gold hover:text-white',
};

const sizeStyles = {
  sm: 'min-h-[36px] px-4 py-2 text-sm',
  md: 'min-h-[44px] px-6 py-3 text-base',
  lg: 'min-h-[52px] px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-sm font-medium
        transition-all duration-200 ease-out cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
