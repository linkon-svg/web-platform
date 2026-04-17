from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PageBase(BaseModel):
    title: str
    slug: str
    content: Optional[dict] = None
    sort_order: int = 0
    is_visible: bool = True


class PageCreate(PageBase):
    site_id: int


class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[dict] = None
    sort_order: Optional[int] = None
    is_visible: Optional[bool] = None


class PageResponse(PageBase):
    id: int
    site_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
