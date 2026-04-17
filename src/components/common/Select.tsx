'use client';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: SelectProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm text-gray-900
          bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${!value ? 'text-gray-400' : ''}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
