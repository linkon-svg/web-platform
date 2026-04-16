interface AdminHeaderProps {
  title: string;
  adminName?: string;
  adminEmail?: string;
  siteUrl?: string;
  onMenuToggle?: () => void;
}

export default function AdminHeader({
  title,
  adminName = '관리자',
  adminEmail,
  siteUrl = '/',
  onMenuToggle,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-admin-card border-b border-admin-border shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-admin-text hover:bg-gray-100 transition-colors"
            aria-label="메뉴 열기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-semibold text-admin-text">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* View site link */}
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-admin-text-secondary hover:text-admin-primary transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3H3v10h10v-3" />
            <path d="M9 2h5v5" />
            <path d="M14 2L7 9" />
          </svg>
          사이트 보기
        </a>

        {/* Admin info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-admin-primary/10 flex items-center justify-center text-admin-primary text-sm font-semibold">
            {adminName.charAt(0)}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-admin-text leading-tight">
              {adminName}
            </p>
            {adminEmail && (
              <p className="text-xs text-admin-text-secondary leading-tight">
                {adminEmail}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
