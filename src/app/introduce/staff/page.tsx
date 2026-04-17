'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import DoctorCard from '@/components/templates/hospital/DoctorCard';
import Loading from '@/components/common/Loading';
import type { Doctor } from '@/types/hospital';

export default function StaffPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1/doctors`)
      .then((res) => res.json())
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="md" />
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              등록된 의료진이 없습니다.
            </div>
          ) : (
            <div className="space-y-16 lg:space-y-24">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  name={doctor.name}
                  title={doctor.title}
                  education={doctor.education}
                  career={doctor.career}
                  photoUrl={doctor.photo_url ? `${API_BASE}${doctor.photo_url}` : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
