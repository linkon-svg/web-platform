from pydantic import BaseModel
from typing import Optional, List


class DoctorCreate(BaseModel):
    name: str
    title: str
    photo_url: Optional[str] = None
    education: Optional[List[str]] = None
    career: Optional[List[str]] = None
    sort_order: Optional[int] = 0


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    photo_url: Optional[str] = None
    education: Optional[List[str]] = None
    career: Optional[List[str]] = None
    sort_order: Optional[int] = None


class DoctorResponse(BaseModel):
    id: int
    hospital_id: int
    name: str
    title: str
    photo_url: Optional[str] = None
    education: Optional[List[str]] = None
    career: Optional[List[str]] = None
    sort_order: int

    model_config = {"from_attributes": True}
