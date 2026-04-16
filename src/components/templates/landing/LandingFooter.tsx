interface FooterLink {
  label: string;
  href: string;
}

interface LandingFooterProps {
  companyName: string;
  phone?: string;
  address?: string;
  bizNumber?: string;
  links?: FooterLink[];
}

export default function LandingFooter({
  companyName,
  phone,
  address,
  bizNumber,
  links,
}: LandingFooterProps) {
  return (
    <footer
      className="w-full py-12 md:py-16 px-4 md:px-8"
      style={{ backgroundColor: "var(--color-landing-bg-dark)" }}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Legal links */}
        {links && links.length > 0 && (
          <nav
            className="flex flex-wrap gap-4 md:gap-6"
            aria-label="법적 링크"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Middle: CTA + enterprise link */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <a
            href="/contact"
            className="landing-cta text-sm"
            aria-label="문의하기"
          >
            문의하기
          </a>
          <a
            href="/enterprise"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors min-h-[44px]"
          >
            기업용 서비스 &rarr;
          </a>
        </div>

        {/* Divider */}
        <hr className="border-gray-700" />

        {/* Bottom: Company info + SNS */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2 text-sm text-gray-500">
            <p className="text-gray-300 font-semibold">{companyName}</p>
            {phone && <p>대표전화: {phone}</p>}
            {address && <p>주소: {address}</p>}
            {bizNumber && <p>사업자등록번호: {bizNumber}</p>}
            <p className="mt-4">
              &copy; {new Date().getFullYear()} {companyName}. All rights
              reserved.
            </p>
          </div>

          {/* SNS placeholders */}
          <div className="flex items-start gap-4">
            {["Instagram", "YouTube", "Blog"].map((name) => (
              <a
                key={name}
                href="#"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-colors min-h-[44px] min-w-[44px]"
                aria-label={name}
              >
                <span className="text-xs font-bold" aria-hidden="true">
                  {name.charAt(0)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
