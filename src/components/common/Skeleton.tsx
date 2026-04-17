'use client';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const variantStyles = {
  text: 'rounded h-4 w-full',
  circular: 'rounded-full',
  rectangular: 'rounded-md',
};

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-shimmer ${variantStyles[variant]} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height:
          height ||
          (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '120px'),
      }}
    />
  ));

  if (count === 1) {
    return items[0];
  }

  return <div className="flex flex-col gap-3">{items}</div>;
}
