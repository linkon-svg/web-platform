const SPACE_IMAGES = [
  { label: '리셉션', gradient: 'from-hospital-beige to-hospital-cream' },
  { label: '상담실', gradient: 'from-hospital-cream to-hospital-beige' },
  { label: '시술실 A', gradient: 'from-hospital-gold-light/20 to-hospital-cream' },
  { label: '시술실 B', gradient: 'from-hospital-beige to-hospital-gold-light/20' },
  { label: '대기실', gradient: 'from-hospital-cream to-hospital-beige' },
  { label: '파우더룸', gradient: 'from-hospital-beige to-hospital-cream' },
  { label: 'VIP 룸', gradient: 'from-hospital-gold-light/20 to-hospital-beige' },
  { label: '복도', gradient: 'from-hospital-cream to-hospital-gold-light/20' },
];

export default function SpacePage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {SPACE_IMAGES.map((space, idx) => (
              <div
                key={idx}
                className="aspect-[16/10] rounded-sm overflow-hidden relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${space.gradient}`}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm text-hospital-brown/60 font-medium">
                    {space.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
