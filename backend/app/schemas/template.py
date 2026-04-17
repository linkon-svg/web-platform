from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TemplateBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None


class TemplateResponse(TemplateBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
