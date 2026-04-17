interface PromotionCardProps {
  title: string;
  gradient?: string;
  imageUrl?: string;
}

export default function PromotionCard({
  title,
  gradient = 'from-hospital-beige to-hospital-cream',
  imageUrl,
}: PromotionCardProps) {
  return (
    <div className="block group">
      <div className="overflow-hidden rounded-sm">
        {imageUrl ? (
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div
            className={`aspect-[4/3] bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}
          >
            <span className="font-serif text-lg text-hospital-gold/40 italic">Promotion</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm md:text-base text-hospital-dark group-hover:text-hospital-gold-dark transition-colors line-clamp-2">
        {title}
      </h3>
    </div>
  );
}
