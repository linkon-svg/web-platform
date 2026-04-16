import { ReactNode } from 'react';

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function AdminCard({
  title,
  children,
  actions,
  className = '',
}: AdminCardProps) {
  return (
    <div
      className={`bg-admin-card rounded-xl border border-admin-border shadow-sm ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          {title && (
            <h3 className="text-lg font-semibold text-admin-text">{title}</h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
