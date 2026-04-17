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

export default async function CorporateDarkNewsPage() {
  const news = (await fetchAPI("/api/corporate/news")) as NewsAPIItem[] | null;

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
            News
          </h1>

          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group block bg-[#1A1A1A] border border-[#333] overflow-hidden transition-all duration-300 hover:bg-[#252525] hover:border-[#555]"
                >
                  {item.image && (
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div className="p-8">
                    {item.category && (
                      <span className="text-[#999] text-xs uppercase tracking-[0.15em] mb-3 block">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-white text-lg font-semibold leading-snug mb-4 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="text-white/50 text-sm font-light leading-relaxed mb-4 line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                    <time className="text-[#999] text-sm font-light tracking-wide">
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
            <p className="text-[#999] text-lg">
              등록된 뉴스가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
