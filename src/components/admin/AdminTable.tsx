import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface AdminTableProps {
  columns: Column[];
  data: Record<string, ReactNode>[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  className?: string;
}

export default function AdminTable({
  columns,
  data,
  onEdit,
  onDelete,
  className = '',
}: AdminTableProps) {
  const hasActions = onEdit || onDelete;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-admin-text-secondary text-xs uppercase tracking-wider ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-right font-semibold text-admin-text-secondary text-xs uppercase tracking-wider">
                관리
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-admin-border last:border-0 hover:bg-admin-bg transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-admin-text ${col.className || ''}`}
                >
                  {row[col.key]}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(idx)}
                        className="px-3 py-1.5 text-xs rounded-md text-admin-primary hover:bg-admin-primary/10 transition-colors"
                      >
                        편집
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(idx)}
                        className="px-3 py-1.5 text-xs rounded-md text-admin-danger hover:bg-admin-danger/10 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-12 text-center text-admin-text-secondary"
              >
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
