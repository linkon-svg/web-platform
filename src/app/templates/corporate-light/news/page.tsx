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

interface NewsAPIItem {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  category?: string;
  published_at?: string;
  created_at?: string;
}

export default async function CorporateLightNewsPage() {
  const news = (await fetchAPI("/api/corporate/news")) as NewsAPIItem[] | null;

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
            News
          </h1>

          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group bg-[#F9F9F9] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.image && (
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div className="p-6">
                    {item.category && (
                      <span className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2 block">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#191919] mb-3 leading-snug line-clamp-2 group-hover:text-[#333] transition-colors">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="text-sm text-[#666] leading-relaxed mb-3 line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                    <time className="text-xs text-[#999]">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString(
                            "ko-KR"
                          )
                        : item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "ko-KR"
                            )
                          : ""}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#666] text-base">
              등록된 뉴스가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
