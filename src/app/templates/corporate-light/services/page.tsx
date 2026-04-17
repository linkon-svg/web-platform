import Link from "next/link";

const API_BASE = "http://localhost:8000";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface ServiceAPIItem {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  link?: string;
  image?: string;
}

export default async function CorporateLightServicesPage() {
  const services = (await fetchAPI("/api/corporate/services")) as
    | ServiceAPIItem[]
    | null;

  return (
    <main className="min-h-screen bg-white text-[#191919]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/templates/corporate-light"
            className="text-xl font-bold text-[#191919] tracking-tight"
          >
            kakao
          </Link>
          <Link
            href="/templates/corporate-light"
            className="text-sm font-medium text-[#666] hover:text-[#191919] transition-colors"
          >
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">
            Services
          </h1>

          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={service.link || "#"}
                  className="group block bg-[#F9F9F9] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {service.image && (
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                  )}
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-[#191919] mb-3 group-hover:text-[#333] transition-colors">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-[#666] leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    <div className="mt-5 flex items-center gap-1 text-sm font-medium text-[#191919] opacity-0 group-hover:opacity-100 transition-opacity">
                      자세히 보기
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[#666] text-base">
              등록된 서비스가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
