from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HospitalCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_number: Optional[str] = None
    ceo: Optional[str] = None
    hero_image_url: Optional[str] = None
    logo_url: Optional[str] = None


class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_number: Optional[str] = None
    ceo: Optional[str] = None
    hero_image_url: Optional[str] = None
    logo_url: Optional[str] = None


class HospitalResponse(BaseModel):
    id: int
    name: str
    name_en: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_number: Optional[str] = None
    ceo: Optional[str] = None
    hero_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ScheduleCreate(BaseModel):
    weekday: Optional[str] = None
    saturday: Optional[str] = None
    sunday: Optional[str] = None
    holiday: Optional[str] = None
    lunch_time: Optional[str] = None


class ScheduleUpdate(BaseModel):
    weekday: Optional[str] = None
    saturday: Optional[str] = None
    sunday: Optional[str] = None
    holiday: Optional[str] = None
    lunch_time: Optional[str] = None


class ScheduleResponse(BaseModel):
    id: int
    hospital_id: int
    weekday: Optional[str] = None
    saturday: Optional[str] = None
    sunday: Optional[str] = None
    holiday: Optional[str] = None
    lunch_time: Optional[str] = None

    model_config = {"from_attributes": True}
