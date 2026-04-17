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

interface CareerAPIItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

export default async function CorporateDarkCareersPage() {
  const careers = (await fetchAPI("/api/corporate/careers")) as
    | CareerAPIItem[]
    | null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#333]">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link
            href="/templates/corporate-dark"
            className="text-white text-xl font-bold tracking-[0.15em] uppercase"
          >
            KRAFTON
          </Link>
          <Link
            href="/templates/corporate-dark"
            className="text-[#999] text-sm tracking-wide uppercase hover:text-white transition-colors"
          >
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="pt-32 pb-28 px-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-[0.05em] mb-20">
            Careers
          </h1>

          {careers && careers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careers.map((career) => (
                <a
                  key={career.id}
                  href={career.link || "#"}
                  className="group relative block overflow-hidden min-h-[360px] md:min-h-[420px]"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${
                        career.image ||
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                      })`,
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-300" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-10">
                    <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-[0.03em] mb-4">
                      {career.title}
                    </h3>
                    {career.description && (
                      <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-md">
                        {career.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[#999] text-lg">
              등록된 채용 정보가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
