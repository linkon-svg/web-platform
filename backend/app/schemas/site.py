from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.template import TemplateResponse
from app.schemas.page import PageResponse
from app.schemas.site_config import SiteConfigResponse


class SiteBase(BaseModel):
    name: str
    slug: str
    template_id: int


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    is_published: Optional[bool] = None


class SiteResponse(SiteBase):
    id: int
    owner_id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SiteDetailResponse(SiteResponse):
    template: TemplateResponse
    pages: List[PageResponse] = []
    config: Optional[SiteConfigResponse] = None
