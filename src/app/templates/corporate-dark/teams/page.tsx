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

interface TeamAPIItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  link?: string;
}

export default async function CorporateDarkTeamsPage() {
  const teams = (await fetchAPI("/api/corporate/teams")) as
    | TeamAPIItem[]
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
            Studios
          </h1>

          {teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {teams.map((team) => (
                <a
                  key={team.id}
                  href={team.link || "#"}
                  className="group relative block overflow-hidden aspect-[3/4]"
                >
                  {/* Background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        team.image ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
                      })`,
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors duration-300" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-7">
                    <h4 className="text-white text-xl font-bold uppercase tracking-[0.02em] mb-2">
                      {team.name}
                    </h4>
                    {team.description && (
                      <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-2">
                        {team.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[#999] text-lg">
              등록된 팀 정보가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
