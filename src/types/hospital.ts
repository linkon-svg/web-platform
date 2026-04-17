export interface HospitalInfo {
  id: number;
  name: string;
  name_en: string;
  phone: string;
  address: string;
  business_number: string;
  ceo: string;
  logo_url: string | null;
}

export interface Doctor {
  id: number;
  hospital_id: number;
  name: string;
  title: string;
  photo_url: string | null;
  education: string[];
  career: string[];
  sort_order: number;
}

export interface Schedule {
  id: number;
  hospital_id: number;
  weekday: string;
  saturday: string;
  sunday: string;
  holiday: string;
  lunch_time: string;
}

export interface Treatment {
  id: number;
  hospital_id: number;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Promotion {
  id: number;
  hospital_id: number;
  title: string;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface PhilosophyItem {
  id: number;
  hospital_id: number;
  icon: string;
  title: string;
  title_ko: string;
  description: string;
  sort_order: number;
}

export interface SpaceImage {
  id: number;
  hospital_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface HeroImage {
  url: string;
  filename: string;
}
