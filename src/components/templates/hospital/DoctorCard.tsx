interface DoctorCardProps {
  name: string;
  title: string;
  education: string[];
  career: string[];
  imageGradient?: string;
  photoUrl?: string;
}

export default function DoctorCard({
  name,
  title,
  education,
  career,
  imageGradient = 'from-hospital-beige via-hospital-cream to-hospital-beige',
  photoUrl,
}: DoctorCardProps) {
  return (
    <div className="group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Portrait */}
        {photoUrl ? (
          <div className="aspect-[3/4] rounded-sm overflow-hidden">
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`aspect-[3/4] rounded-sm bg-gradient-to-b ${imageGradient} flex items-end justify-center overflow-hidden`}>
            <div className="w-3/4 h-3/4 bg-gradient-to-t from-hospital-brown-light/20 to-transparent rounded-t-full" />
          </div>
        )}

        {/* Info */}
        <div className="py-4">
          {/* Title */}
          <p className="text-sm text-hospital-gold tracking-wide mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-medium text-hospital-dark mb-8">
            {name}
          </h3>

          {/* Education */}
          <div className="mb-6">
            <h4 className="text-xs text-hospital-gray-light uppercase tracking-wider mb-3">
              학력
            </h4>
            <ul className="space-y-1.5">
              {education.map((item, idx) => (
                <li key={idx} className="text-sm text-hospital-gray leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Career */}
          <div>
            <h4 className="text-xs text-hospital-gray-light uppercase tracking-wider mb-3">
              이력
            </h4>
            <ul className="space-y-1.5">
              {career.map((item, idx) => (
                <li key={idx} className="text-sm text-hospital-gray leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
