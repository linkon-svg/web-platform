'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

type InputType = 'text' | 'textarea' | 'select';

interface Option {
  label: string;
  value: string;
}

interface AdminInputProps {
  label: string;
  name: string;
  type?: InputType;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  placeholder?: string;
  options?: Option[];
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> &
    SelectHTMLAttributes<HTMLSelectElement>;
}

export default function AdminInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  options = [],
  className = '',
}: AdminInputProps) {
  const baseClasses = `
    w-full rounded-lg border px-3 py-2 text-sm text-admin-text
    placeholder:text-admin-text-secondary/60
    focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary
    transition-colors
    ${error ? 'border-admin-danger' : 'border-admin-border'}
  `;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-admin-text"
      >
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`${baseClasses} resize-y min-h-[100px]`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} bg-white`}
        >
          <option value="">{placeholder || '선택하세요'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {error && (
        <p className="text-xs text-admin-danger">{error}</p>
      )}
    </div>
  );
}
