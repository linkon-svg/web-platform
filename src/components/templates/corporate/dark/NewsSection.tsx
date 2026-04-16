"use client";

export interface NewsItem {
  title: string;
  date: string;
  href: string;
}

interface NewsSectionProps {
  heading?: string;
  items: NewsItem[];
}

export default function NewsSection({
  heading = "News",
  items,
}: NewsSectionProps) {
  return (
    <section className="bg-black py-28 px-8">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-[0.03em] mb-14">
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="group block bg-[#1A1A1A] border border-[#333] p-8 transition-all duration-300 hover:bg-[#252525] hover:border-[#555]"
            >
              <h4 className="text-white text-lg font-semibold leading-snug mb-6 group-hover:text-white/90 transition-colors line-clamp-2">
                {item.title}
              </h4>
              <time className="text-[#999] text-sm font-light tracking-wide">
                {item.date}
              </time>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
