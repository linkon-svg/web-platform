export default function MinorConsentPage() {
  return (
    <>
      <div className="h-16 lg:h-20" />
      <div className="section-padding">
        <div className="section-narrow">
          <h1 className="text-3xl md:text-4xl font-serif text-hospital-dark mb-10">
            미성년시술동의서
          </h1>

          <div className="space-y-10 text-hospital-gray leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제1조 (목적)
              </h2>
              <p>
                본 동의서는 예피다의원(이하 &quot;병원&quot;)에서 만 19세 미만의 미성년자(이하
                &quot;환자&quot;)에게 미용 시술을 시행함에 있어, 의료법 및 관련 법령에 따라
                법정대리인(부모 또는 후견인)의 동의를 확인하기 위한 것입니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제2조 (법정대리인 동의 요건)
              </h2>
              <p>
                미성년자의 미용 시술은 반드시 법정대리인의 동의가 필요합니다.
                법정대리인은 시술 전 다음 사항을 확인하고 동의하여야 합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>시술의 종류, 목적 및 예상 효과</li>
                <li>시술 과정에서 발생할 수 있는 부작용 및 위험성</li>
                <li>시술 후 주의사항 및 사후 관리 방법</li>
                <li>시술 비용 및 환불 규정</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제3조 (필요 서류)
              </h2>
              <p>
                미성년자의 시술을 위해 다음 서류를 지참하셔야 합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>법정대리인 신분증 사본 (주민등록증, 운전면허증 등)</li>
                <li>가족관계증명서 또는 법정대리인 확인 서류</li>
                <li>법정대리인 자필 서명이 포함된 동의서 원본</li>
                <li>미성년자 본인의 신분증 또는 학생증</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제4조 (시술 제한 사항)
              </h2>
              <p>
                병원은 미성년자의 안전을 최우선으로 고려하며, 다음의 경우 시술을
                제한하거나 거부할 수 있습니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>법정대리인의 동의가 확인되지 않는 경우</li>
                <li>의료진이 판단하기에 시술이 환자에게 적합하지 않은 경우</li>
                <li>환자의 건강 상태가 시술에 부적합한 경우</li>
                <li>관련 법령에 의해 시술이 제한되는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제5조 (개인정보 처리)
              </h2>
              <p>
                미성년자 및 법정대리인의 개인정보는 시술 동의 확인 및 진료 기록 보관
                목적으로만 사용되며, 의료법에 따라 안전하게 관리됩니다. 자세한 사항은
                병원의 개인정보처리방침을 참고하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-hospital-dark mb-3">
                제6조 (동의 철회)
              </h2>
              <p>
                법정대리인은 시술 시행 전까지 언제든지 동의를 철회할 수 있습니다.
                동의 철회 시 병원에 직접 방문하거나 전화(02-6952-2586)로 연락하시면
                됩니다. 시술이 이미 시행된 경우에는 동의 철회가 제한될 수 있습니다.
              </p>
            </section>

            <p className="text-sm text-hospital-gray/60 pt-6 border-t border-hospital-cream">
              본 동의서는 2026년 4월 17일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
