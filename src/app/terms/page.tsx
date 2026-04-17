export default function TermsPage() {
  return (
    <>
      <div className="h-16 lg:h-20" />
      <div className="section-padding">
        <div className="section-narrow">
          <h1 className="text-3xl md:text-4xl font-serif text-hospital-dark mb-10">
            이용약관
          </h1>

          <div className="space-y-10 text-hospital-gray leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제1조 (목적)
              </h2>
              <p>
                본 약관은 예피다의원(이하 &quot;병원&quot;)이 운영하는 웹사이트(이하 &quot;사이트&quot;)에서
                제공하는 온라인 정보 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차에 관한
                사항을 규정함을 목적으로 합니다. 본 약관에 명시되지 않은 사항은 관계
                법령 및 병원의 운영 정책에 따릅니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제2조 (서비스의 내용)
              </h2>
              <p>
                병원은 사이트를 통해 다음과 같은 서비스를 제공합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>병원 소개 및 의료진 정보 제공</li>
                <li>진료 과목 및 시술 정보 안내</li>
                <li>온라인 상담 접수 및 예약 안내</li>
                <li>프로모션 및 이벤트 정보 제공</li>
                <li>기타 병원이 정하는 서비스</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제3조 (이용자의 의무)
              </h2>
              <p>
                이용자는 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>타인의 개인정보를 도용하거나 허위 정보를 기재하는 행위</li>
                <li>서비스를 이용하여 얻은 정보를 병원의 사전 동의 없이 복제, 배포하는 행위</li>
                <li>병원 또는 제3자의 명예를 훼손하거나 업무를 방해하는 행위</li>
                <li>기타 관계 법령에 위반되는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제4조 (서비스의 변경 및 중단)
              </h2>
              <p>
                병원은 운영상 또는 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나
                중단할 수 있습니다. 서비스 변경 또는 중단 시 병원은 사이트를 통해 사전에
                공지합니다. 다만, 불가피한 사유가 있는 경우 사후에 공지할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제5조 (면책 사항)
              </h2>
              <p>
                병원은 천재지변, 시스템 장애 등 불가항력적 사유로 인해 서비스를 제공할 수
                없는 경우 책임이 면제됩니다. 사이트에 게시된 정보는 참고 목적으로 제공되며,
                실제 진료 및 시술에 관한 사항은 반드시 의료진과의 직접 상담을 통해
                확인하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제6조 (분쟁 해결)
              </h2>
              <p>
                본 약관과 관련하여 분쟁이 발생한 경우, 병원과 이용자는 상호 협의하여
                해결하도록 노력합니다. 협의가 이루어지지 않을 경우 관할 법원에 소를
                제기할 수 있으며, 관할 법원은 민사소송법에 따라 정합니다.
              </p>
            </section>

            <p className="text-sm text-hospital-gray/60 pt-6 border-t border-hospital-cream">
              본 약관은 2026년 4월 17일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
