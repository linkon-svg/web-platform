export interface HospitalInfo {
  name: string;
  nameEn: string;
  phone: string;
  address: string;
  businessNumber: string;
  ceo: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;       // 대표원장, 부원장, 원장
  photo: string;
  education: string[];
  career: string[];
}

export interface Schedule {
  weekday: string;
  saturday: string;
  sunday: string;
  holiday: string;
  lunchTime: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

export interface Promotion {
  id: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
}

export interface PhilosophyItem {
  icon: string;
  title: string;
  titleKo: string;
  description: string;
}
