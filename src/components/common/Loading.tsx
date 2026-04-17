'use client';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: LoadingProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          rounded-full border-gray-300 border-t-gray-600
          animate-spin-custom
          ${sizeStyles[size]}
        `}
      />
      {text && (
        <p className={`text-gray-500 ${textSizeStyles[size]}`}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        {spinner}
      </div>
    );
  }

  return spinner;
}
