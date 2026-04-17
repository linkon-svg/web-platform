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

interface MilestoneAPIItem {
  id: number;
  year: number;
  month?: number;
  title: string;
  description?: string;
  image?: string;
}

export default async function CorporateLightMilestonesPage() {
  const milestones = (await fetchAPI("/api/corporate/milestones")) as
    | MilestoneAPIItem[]
    | null;

  /* Group milestones by year */
  const grouped: Record<number, MilestoneAPIItem[]> = {};
  if (milestones) {
    for (const m of milestones) {
      if (!grouped[m.year]) grouped[m.year] = [];
      grouped[m.year].push(m);
    }
  }
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">
            Milestones
          </h1>

          {years.length > 0 ? (
            <div className="relative">
              {/* Center line (desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E5E5] -translate-x-1/2" />
              {/* Left line (mobile) */}
              <div className="md:hidden absolute left-4 top-0 bottom-0 w-px bg-[#E5E5E5]" />

              {years.map((year) => (
                <div key={year} className="mb-16 last:mb-0">
                  {/* Year label */}
                  <div className="relative mb-8">
                    {/* Desktop center */}
                    <div className="hidden md:flex justify-center">
                      <span className="bg-[#191919] text-white text-sm font-bold px-5 py-2 rounded-full relative z-10">
                        {year}
                      </span>
                    </div>
                    {/* Mobile left */}
                    <div className="md:hidden pl-12">
                      <span className="bg-[#191919] text-white text-sm font-bold px-4 py-1.5 rounded-full">
                        {year}
                      </span>
                    </div>
                  </div>

                  {/* Items for this year */}
                  {grouped[year].map((item, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                      <div key={item.id}>
                        {/* Desktop: alternating */}
                        <div className="hidden md:block relative mb-12 last:mb-0">
                          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#191919] z-10 top-2" />
                          <div
                            className={`flex items-start gap-12 ${
                              isLeft ? "flex-row" : "flex-row-reverse"
                            }`}
                          >
                            <div
                              className={`w-1/2 ${
                                isLeft ? "text-right pr-12" : "text-left pl-12"
                              }`}
                            >
                              {item.month && (
                                <span className="text-xs font-bold text-[#999] tracking-wider">
                                  {item.month}월
                                </span>
                              )}
                              <h3 className="text-lg font-bold text-[#191919] mt-1 mb-2">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-sm text-[#666] leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div
                              className={`w-1/2 ${
                                isLeft ? "pl-12" : "pr-12"
                              }`}
                            >
                              {item.image && (
                                <div className="w-full h-40 bg-[#F9F9F9] rounded-xl overflow-hidden">
                                  <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url(${item.image})`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mobile: vertical */}
                        <div className="md:hidden relative pl-12 mb-8 last:mb-0">
                          <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-[#191919] z-10" />
                          {item.month && (
                            <span className="text-xs font-bold text-[#999] tracking-wider">
                              {item.month}월
                            </span>
                          )}
                          <h3 className="text-base font-bold text-[#191919] mt-1 mb-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-[#666] leading-relaxed mb-3">
                              {item.description}
                            </p>
                          )}
                          {item.image && (
                            <div className="w-full h-36 bg-[#F9F9F9] rounded-lg overflow-hidden">
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${item.image})`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#666] text-base text-center">
              등록된 연혁이 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
