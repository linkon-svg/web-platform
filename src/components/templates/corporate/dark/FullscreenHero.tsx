"use client";

interface FullscreenHeroProps {
  backgroundImage?: string;
  backgroundVideo?: string;
  title?: string;
  subtitle?: string;
  showScrollIndicator?: boolean;
}

export default function FullscreenHero({
  backgroundImage = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80",
  backgroundVideo,
  title,
  subtitle,
  showScrollIndicator = true,
}: FullscreenHeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video or Image */}
      {backgroundVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {/* Title Overlay */}
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          {title && (
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-[0.05em] leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-white/70 text-base md:text-lg font-light mt-6 max-w-2xl tracking-wide">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          >
            <path d="M4 7l6 6 6-6" />
          </svg>
        </div>
      )}
    </section>
  );
}
