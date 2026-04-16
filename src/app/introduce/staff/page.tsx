import DoctorCard from '@/components/templates/hospital/DoctorCard';

const DOCTORS = [
  {
    name: '김종석',
    title: '대표원장',
    education: ['연세대학교 의과대학 졸업', '연세대학교 의과대학원 석사'],
    career: [
      '대한피부과학회 정회원',
      '대한레이저의학회 정회원',
      '대한미용피부외과학회 정회원',
      '前 연세대학교 세브란스병원 피부과 전공의',
    ],
  },
  {
    name: '이수현',
    title: '부원장',
    education: ['서울대학교 의과대학 졸업', '서울대학교 의과대학원 석사'],
    career: [
      '대한레이저의학회 정회원',
      '대한피부과학회 정회원',
      '前 서울대학교병원 피부과 전공의',
      '국제 피부과학회(ISD) 회원',
    ],
  },
  {
    name: '박지영',
    title: '원장',
    education: ['고려대학교 의과대학 졸업', '고려대학교 의과대학원 석사'],
    career: [
      '대한미용피부외과학회 정회원',
      '대한피부과학회 정회원',
      '前 고려대학교 안암병원 피부과 전공의',
      '대한비만학회 정회원',
    ],
  },
];

export default function StaffPage() {
  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <section className="section-padding bg-white">
        <div className="section-narrow">
          {/* Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic">
              YEPIDA Doctor
            </h1>
            <p className="mt-4 text-base md:text-lg text-hospital-gray leading-relaxed max-w-lg mx-auto">
              풍부한 경험과 전문성을 갖춘
              <br />
              예피다의 의료진을 소개합니다
            </p>
          </div>

          {/* Doctor List */}
          <div className="space-y-16 lg:space-y-24">
            {DOCTORS.map((doctor, idx) => (
              <DoctorCard
                key={idx}
                name={doctor.name}
                title={doctor.title}
                education={doctor.education}
                career={doctor.career}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
