import Button from '@/components/common/Button';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gold-wave" />

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-hospital-gold-light rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-hospital-gold rounded-full blur-3xl" />
      </div>

      <div className="relative section-padding">
        <div className="section-narrow text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic leading-tight">
            Bloom Your Beauty
          </h2>
          <p className="mt-4 text-base md:text-lg text-hospital-gray font-light">
            당신의 아름다움이 피어나는 곳
          </p>
          <div className="mt-8">
            <Button variant="secondary" size="lg">
              상담 예약하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
