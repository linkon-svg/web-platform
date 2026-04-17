import { API_BASE } from '@/lib/api';

const API_BASE_URL = 'http://localhost:8000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const FALLBACK_SPACES = [
  { label: '리셉션', gradient: 'from-hospital-beige to-hospital-cream' },
  { label: '상담실', gradient: 'from-hospital-cream to-hospital-beige' },
  { label: '시술실 A', gradient: 'from-hospital-gold-light/20 to-hospital-cream' },
  { label: '시술실 B', gradient: 'from-hospital-beige to-hospital-gold-light/20' },
  { label: '대기실', gradient: 'from-hospital-cream to-hospital-beige' },
  { label: '파우더룸', gradient: 'from-hospital-beige to-hospital-cream' },
  { label: 'VIP 룸', gradient: 'from-hospital-gold-light/20 to-hospital-beige' },
  { label: '복도', gradient: 'from-hospital-cream to-hospital-gold-light/20' },
];

const GRADIENTS = [
  'from-hospital-beige to-hospital-cream',
  'from-hospital-cream to-hospital-beige',
  'from-hospital-gold-light/20 to-hospital-cream',
  'from-hospital-beige to-hospital-gold-light/20',
  'from-hospital-cream to-hospital-beige',
  'from-hospital-beige to-hospital-cream',
  'from-hospital-gold-light/20 to-hospital-beige',
  'from-hospital-cream to-hospital-gold-light/20',
];

export default async function SpacePage() {
  const spaces = await fetchAPI('/api/hospitals/1/spaces');

  const spaceItems = spaces && spaces.length > 0
    ? spaces.map((s: { id?: number; image_url: string; caption?: string }, idx: number) => ({
        id: s.id,
        label: s.caption || `공간 ${idx + 1}`,
        gradient: GRADIENTS[idx % GRADIENTS.length],
        image_url: s.image_url,
        caption: s.caption,
      }))
    : FALLBACK_SPACES;

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <section className="section-padding bg-white">
        <div className="section-narrow">
          {/* Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic">
              Yepida Place
            </h1>
            <p className="mt-4 text-base md:text-lg text-hospital-gray leading-relaxed max-w-lg mx-auto">
              편안하고 프라이빗한 공간에서
              <br />
              최상의 시술을 경험하세요
            </p>
          </div>

          {/* Space Gallery Grid */}
          {spaceItems.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              등록된 공간 사진이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {spaceItems.map((space: { id?: number; label: string; gradient: string; image_url?: string; caption?: string }, idx: number) => (
                <div
                  key={space.id ?? idx}
                  className="aspect-[16/10] rounded-sm overflow-hidden relative group"
                >
                  {space.image_url ? (
                    <img
                      src={`${API_BASE}${space.image_url}`}
                      alt={space.caption ?? space.label ?? '공간 사진'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${space.gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-sm text-hospital-brown/60 font-medium">
                      {space.caption ?? space.label ?? ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
