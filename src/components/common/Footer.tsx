export default function Footer() {
  return (
    <footer className="bg-hospital-beige">
      {/* Upper Section: Contact + Hours */}
      <div className="section-narrow py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact */}
          <div>
            <p className="text-3xl lg:text-4xl font-bold text-hospital-dark tracking-tight">
              02-6952-2586
            </p>
            <p className="mt-2 text-hospital-gray text-sm">
              예피다의원과 상담하세요
            </p>
          </div>

          {/* Business Hours */}
          <div className="text-sm text-hospital-gray leading-relaxed">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span>
                <strong className="text-hospital-dark">평일(Weekday)</strong> 10:00 - 20:30
              </span>
              <span>
                <strong className="text-hospital-dark">토(Sat)</strong> 10:00 - 16:00
              </span>
              <span>
                <strong className="text-hospital-dark">일(Sun)</strong> 10:00 - 16:00
              </span>
            </div>
            <p className="mt-1">
              <strong className="text-hospital-dark">점심시간(Lunch)</strong> 없음 &nbsp;·&nbsp;
              공휴일 10:00 - 16:00
            </p>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="border-t border-hospital-gold-light/30">
        <div className="section-narrow py-4 flex flex-wrap items-center gap-4 text-xs text-hospital-gray">
          <a href="/terms" className="hover:text-hospital-dark transition-colors">이용약관</a>
          <span className="text-hospital-gray-light">·</span>
          <a href="/privacy" className="hover:text-hospital-dark transition-colors font-medium">개인정보처리방침</a>
          <span className="text-hospital-gray-light">·</span>
          <a href="/minor-consent" className="hover:text-hospital-dark transition-colors">미성년시술동의서</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-hospital-gold-light/20 bg-white">
        <div className="section-narrow py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-widest text-hospital-brown">
              YEPIDA CLINIC
            </span>
          </div>

          {/* Business Info */}
          <p className="text-[11px] text-hospital-gray-light leading-relaxed">
            TEL : 02-6952-2586 &nbsp;|&nbsp; 주소 : 서울특별시 강남구 강남대로 424 (신사빌딩) 6층
            <br className="md:hidden" />
            <span className="hidden md:inline"> &nbsp;|&nbsp; </span>
            상호 : 예피다의원 &nbsp;|&nbsp; 사업자번호 : 234-38-01532 &nbsp;|&nbsp; 대표자 : 김종석
          </p>
        </div>
      </div>

      {/* Bottom CTA spacing for mobile */}
      <div className="h-16 lg:hidden" />
    </footer>
  );
}
