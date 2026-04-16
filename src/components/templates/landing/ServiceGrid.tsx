interface ServiceItem {
  id: string;
  icon?: string;
  name: string;
  description: string;
  link: string;
}

interface ServiceGridProps {
  title: string;
  services: ServiceItem[];
}

export default function ServiceGrid({ title, services }: ServiceGridProps) {
  return (
    <section
      className="landing-section"
      style={{ backgroundColor: "var(--color-landing-bg-alt)" }}
    >
      <div className="landing-container">
        <h2
          className="text-2xl md:text-4xl font-bold mb-12 text-center"
          style={{
            fontFamily: "var(--font-landing-display)",
            color: "var(--color-landing-text)",
          }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-landing-bg)",
                border: "1px solid var(--color-landing-border)",
              }}
            >
              {/* Icon placeholder */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                style={{
                  backgroundColor: "var(--color-landing-primary-light)",
                }}
              >
                <span
                  className="text-xl"
                  style={{ color: "var(--color-landing-primary)" }}
                  aria-hidden="true"
                >
                  {service.icon || "★"}
                </span>
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--color-landing-text)" }}
              >
                {service.name}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--color-landing-text-secondary)" }}
              >
                {service.description}
              </p>
              <a
                href={service.link}
                className="inline-flex items-center gap-1 text-sm font-semibold transition-colors min-h-[44px]"
                style={{ color: "var(--color-landing-primary)" }}
              >
                자세히 보기
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
