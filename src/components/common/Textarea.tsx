'use client';

import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          transition-colors duration-200
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
          ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
