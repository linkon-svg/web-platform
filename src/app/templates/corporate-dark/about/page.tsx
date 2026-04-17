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

export default async function CorporateDarkAboutPage() {
  const config = await fetchAPI("/api/corporate/config");

  const companyName = config?.company_name || "Company";
  const visionTitle = config?.vision_title || "Vision";
  const visionDescription =
    config?.vision_description ||
    "미지의 영역에 도전하며 새로운 경험을 만들어갑니다.";
  const missionTitle = config?.mission_title || "Mission";
  const missionDescription =
    config?.mission_description ||
    "기술과 창의성을 결합하여 세계적인 콘텐츠를 만듭니다.";
  const aboutContent = config?.about_content || null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#333]">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link
            href="/templates/corporate-dark"
            className="text-white text-xl font-bold tracking-[0.15em] uppercase"
          >
            {companyName}
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
            About
          </h1>

          {/* Vision */}
          <section className="mb-24">
            <h2 className="text-[#999] text-sm tracking-[0.2em] uppercase mb-4">
              {visionTitle}
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl">
              {visionDescription}
            </p>
          </section>

          {/* Mission */}
          <section className="mb-24">
            <h2 className="text-[#999] text-sm tracking-[0.2em] uppercase mb-4">
              {missionTitle}
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl">
              {missionDescription}
            </p>
          </section>

          {/* About Content */}
          {aboutContent && (
            <section className="mb-24">
              <h2 className="text-[#999] text-sm tracking-[0.2em] uppercase mb-4">
                Overview
              </h2>
              <div className="text-lg text-white/70 font-light leading-relaxed max-w-3xl whitespace-pre-line">
                {aboutContent}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
