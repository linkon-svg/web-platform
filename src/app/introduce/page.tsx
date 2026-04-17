import HeroSection from '@/components/templates/hospital/HeroSection';
import PhilosophySection from '@/components/templates/hospital/PhilosophySection';
import CTASection from '@/components/templates/hospital/CTASection';
import MapSection from '@/components/templates/hospital/MapSection';

const API_BASE = 'http://localhost:8000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function IntroducePage() {
  const [hospital, philosophies] = await Promise.all([
    fetchAPI('/api/hospitals/1'),
    fetchAPI('/api/hospitals/1/philosophy'),
  ]);

  const hospitalName = hospital?.name || '예피다의원';
  const hospitalNameEn = hospital?.name_en || 'YEPIDA';

  return (
    <>
      <HeroSection
        title={hospitalNameEn + ' CLINIC'}
        subtitle={`건강한 아름다움을 추구하는 ${hospitalName}`}
      />

      {/* Hospital Introduction */}
      <section className="section-padding bg-white">
        <div className="section-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic mb-8">
              {hospitalNameEn}
            </h2>
            <p className="text-base md:text-lg text-hospital-gray leading-relaxed">
              {hospitalName}은 &ldquo;아름다움이 피어나다&rdquo;라는 뜻을 담고 있습니다.
              <br className="hidden md:block" />
              자연스러운 아름다움을 추구하며, 안전하고 검증된 시술만을 제공합니다.
            </p>
            <p className="mt-6 text-base md:text-lg text-hospital-gray leading-relaxed">
              최신 의료 장비와 풍부한 경험을 갖춘 의료진이
              <br className="hidden md:block" />
              환자 한 분 한 분에게 맞춤형 진료를 제공하여
              <br className="hidden md:block" />
              최상의 결과를 이끌어냅니다.
            </p>
          </div>
        </div>
      </section>

      <PhilosophySection philosophies={philosophies} />

      <CTASection />

      <MapSection />
    </>
  );
}
