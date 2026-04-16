from pydantic import BaseModel
from typing import Optional


class TreatmentCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0


class TreatmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None


class TreatmentResponse(BaseModel):
    id: int
    hospital_id: int
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int

    model_config = {"from_attributes": True}
