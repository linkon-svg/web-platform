export default function PrivacyPage() {
  return (
    <>
      <div className="h-16 lg:h-20" />
      <div className="section-padding">
        <div className="section-narrow">
          <h1 className="text-3xl md:text-4xl font-serif text-hospital-dark mb-10">
            개인정보처리방침
          </h1>

          <div className="space-y-10 text-hospital-gray leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제1조 (개인정보의 수집 항목 및 수집 방법)
              </h2>
              <p>
                예피다의원(이하 &quot;병원&quot;)은 상담 및 예약 서비스 제공을 위해 다음과 같은
                개인정보를 수집할 수 있습니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>필수 항목: 이름, 연락처(휴대전화번호)</li>
                <li>선택 항목: 이메일 주소, 상담 희망 내용, 방문 희망 일시</li>
                <li>자동 수집 항목: 접속 IP, 방문 일시, 브라우저 종류, 서비스 이용 기록</li>
              </ul>
              <p className="mt-2">
                개인정보는 웹사이트 상담 신청 양식, 전화 상담, 카카오톡 채널을 통해
                수집됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제2조 (개인정보의 수집 및 이용 목적)
              </h2>
              <p>
                병원은 수집한 개인정보를 다음의 목적을 위해 이용합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>상담 접수 및 회신, 예약 확인 및 안내</li>
                <li>진료 서비스 제공 및 사후 관리</li>
                <li>서비스 개선 및 신규 서비스 개발을 위한 통계 분석</li>
                <li>법령에 따른 의무 이행</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제3조 (개인정보의 보유 및 이용 기간)
              </h2>
              <p>
                병원은 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이
                파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서
                정한 기간 동안 보관합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>의료법에 따른 진료 기록: 10년</li>
                <li>전자상거래 등에서의 소비자 보호에 관한 법률에 따른 표시/광고에 관한 기록: 6개월</li>
                <li>통신비밀보호법에 따른 웹사이트 방문 기록: 3개월</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제4조 (개인정보의 제3자 제공)
              </h2>
              <p>
                병원은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제5조 (정보주체의 권리 및 행사 방법)
              </h2>
              <p>
                이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지를
                요구할 수 있습니다. 권리 행사는 병원에 전화(02-6952-2586) 또는
                방문을 통해 하실 수 있으며, 병원은 지체 없이 필요한 조치를 취합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제6조 (개인정보의 안전성 확보 조치)
              </h2>
              <p>
                병원은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>개인정보 접근 권한 제한 및 관리</li>
                <li>개인정보의 암호화</li>
                <li>보안 프로그램 설치 및 주기적 갱신</li>
                <li>개인정보 처리 직원의 최소화 및 교육 실시</li>
              </ul>
            </section>

            <p className="text-sm text-hospital-gray/60 pt-6 border-t border-hospital-cream">
              본 개인정보처리방침은 2026년 4월 17일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
