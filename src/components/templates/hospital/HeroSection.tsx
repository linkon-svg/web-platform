interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function HeroSection({
  title = 'YEPIDA CLINIC',
  subtitle = '당신의 아름다움이 피어나는 곳',
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full h-screen min-h-[600px] max-h-[900px] flex items-center justify-center ${className}`}
    >
      {/* Background placeholder - gradient simulating clinic interior */}
      <div className="absolute inset-0 bg-hero-placeholder" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-hospital-brown/60 via-hospital-brown/30 to-hospital-brown/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white tracking-wider leading-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/80 font-light tracking-wide">
          {subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
