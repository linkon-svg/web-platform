from pydantic import BaseModel
from datetime import date
from typing import Optional


class PromotionCreate(BaseModel):
    title: str
    image_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = True


class PromotionUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class PromotionResponse(BaseModel):
    id: int
    hospital_id: int
    title: str
    image_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool

    model_config = {"from_attributes": True}
