"use client";

export interface TeamCard {
  name: string;
  description: string;
  backgroundImage: string;
  href?: string;
}

interface TeamGridProps {
  heading?: string;
  moreHref?: string;
  cards: TeamCard[];
}

export default function TeamGrid({
  heading = "Studios",
  moreHref = "#",
  cards,
}: TeamGridProps) {
  return (
    <section className="bg-black py-28 px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-[0.03em]">
            {heading}
          </h2>
          <a
            href={moreHref}
            className="text-[#999] text-sm tracking-wide uppercase hover:text-white transition-colors"
          >
            More
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <a
              key={i}
              href={card.href || "#"}
              className="group relative block overflow-hidden aspect-[3/4]"
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-7">
                <h4 className="text-white text-xl font-bold uppercase tracking-[0.02em] mb-2">
                  {card.name}
                </h4>
                <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-2">
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
