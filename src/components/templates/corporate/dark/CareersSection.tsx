"use client";

export interface CareerCard {
  heading: string;
  description: string;
  backgroundImage: string;
  href: string;
}

interface CareersSectionProps {
  cards: CareerCard[];
}

export default function CareersSection({ cards }: CareersSectionProps) {
  return (
    <section className="bg-black py-28 px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              className="group relative block overflow-hidden min-h-[360px] md:min-h-[420px]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-10">
                <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-[0.03em] mb-4">
                  {card.heading}
                </h3>
                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-md">
                  {card.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
