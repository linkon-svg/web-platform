from typing import Optional
from pydantic import BaseModel, ConfigDict


class SiteConfigBase(BaseModel):
    logo_url: Optional[str] = None
    primary_color: str = "#000000"
    secondary_color: str = "#ffffff"
    font_family: str = "Pretendard"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    custom_css: Optional[str] = None
    extra_settings: Optional[dict] = None


class SiteConfigCreate(SiteConfigBase):
    site_id: int


class SiteConfigUpdate(BaseModel):
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    font_family: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    custom_css: Optional[str] = None
    extra_settings: Optional[dict] = None


class SiteConfigResponse(SiteConfigBase):
    id: int
    site_id: int

    model_config = ConfigDict(from_attributes=True)
