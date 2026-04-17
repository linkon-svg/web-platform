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

export default async function CorporateLightAboutPage() {
  const config = await fetchAPI("/api/corporate/config");

  const companyName = config?.company_name || "kakao";
  const visionTitle = config?.vision_title || "Vision";
  const visionDescription =
    config?.vision_description ||
    "AI 기술을 기반으로 사람과 사람, 사람과 세상을 더 가깝게 연결합니다.";
  const missionTitle = config?.mission_title || "Mission";
  const missionDescription =
    config?.mission_description ||
    "기술의 힘으로 더 나은 세상을 만들어갑니다.";
  const aboutContent = config?.about_content || null;

  return (
    <main className="min-h-screen bg-white text-[#191919]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/templates/corporate-light"
            className="text-xl font-bold text-[#191919] tracking-tight"
          >
            {companyName}
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
            About
          </h1>

          {/* Vision */}
          <section className="mb-20">
            <h2 className="text-sm font-bold text-[#999] tracking-wider uppercase mb-4">
              {visionTitle}
            </h2>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed max-w-3xl tracking-tight">
              {visionDescription}
            </p>
          </section>

          {/* Mission */}
          <section className="mb-20">
            <h2 className="text-sm font-bold text-[#999] tracking-wider uppercase mb-4">
              {missionTitle}
            </h2>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed max-w-3xl tracking-tight">
              {missionDescription}
            </p>
          </section>

          {/* About Content */}
          {aboutContent && (
            <section className="mb-20 bg-[#F9F9F9] rounded-xl p-10">
              <h2 className="text-sm font-bold text-[#999] tracking-wider uppercase mb-4">
                Overview
              </h2>
              <div className="text-base text-[#666] leading-relaxed max-w-3xl whitespace-pre-line">
                {aboutContent}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
