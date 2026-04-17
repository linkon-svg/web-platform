import Link from "next/link";

const API_BASE = 'http://localhost:8000';

interface CategoryBannerProps {
  title: string;
  description: string;
  image?: string;
  link: string;
}

export default function CategoryBanner({
  title,
  description,
  image,
  link,
}: CategoryBannerProps) {
  return (
    <Link href={link} className="group relative block overflow-hidden">
      {/* Image area */}
      <div
        className="w-full aspect-[16/9] transition-all duration-500 group-hover:brightness-75 overflow-hidden"
        style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
      >
        {image && (
          <img
            src={image.startsWith('http') ? image : `${API_BASE}${image}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h3
          className="text-2xl lg:text-3xl font-light mb-2"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            color: "var(--color-shop-text, #000)",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
        <p
          className="text-xs font-light"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            color: "var(--color-shop-text-secondary, #999)",
            letterSpacing: "0.1em",
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
