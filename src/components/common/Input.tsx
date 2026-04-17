'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...rest}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
