from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# ── LandingConfig ──

class LandingConfigUpdate(BaseModel):
    site_name: Optional[str] = None
    logo: Optional[str] = None
    promo_bar_text: Optional[str] = None
    promo_bar_link: Optional[str] = None
    promo_bar_active: Optional[bool] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_link: Optional[str] = None
    hero_background: Optional[str] = None
    footer_company_name: Optional[str] = None
    footer_ceo: Optional[str] = None
    footer_address: Optional[str] = None
    footer_phone: Optional[str] = None
    footer_email: Optional[str] = None
    footer_business_number: Optional[str] = None
    footer_links: Optional[Any] = None
    sns_links: Optional[Any] = None
    app_download_links: Optional[Any] = None


class LandingConfigResponse(BaseModel):
    id: int
    site_name: str
    logo: Optional[str] = None
    promo_bar_text: Optional[str] = None
    promo_bar_link: Optional[str] = None
    promo_bar_active: bool
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_link: Optional[str] = None
    hero_background: Optional[str] = None
    footer_company_name: Optional[str] = None
    footer_ceo: Optional[str] = None
    footer_address: Optional[str] = None
    footer_phone: Optional[str] = None
    footer_email: Optional[str] = None
    footer_business_number: Optional[str] = None
    footer_links: Optional[Any] = None
    sns_links: Optional[Any] = None
    app_download_links: Optional[Any] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── LandingSection ──

class LandingSectionCreate(BaseModel):
    title: str
    title_image: Optional[str] = None
    heading: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_image: Optional[str] = None
    background_color: Optional[str] = None
    layout: Optional[str] = "left-text"
    has_carousel: Optional[bool] = False
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class LandingSectionUpdate(BaseModel):
    title: Optional[str] = None
    title_image: Optional[str] = None
    heading: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_image: Optional[str] = None
    background_color: Optional[str] = None
    layout: Optional[str] = None
    has_carousel: Optional[bool] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class LandingSectionResponse(BaseModel):
    id: int
    title: str
    title_image: Optional[str] = None
    heading: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_image: Optional[str] = None
    background_color: Optional[str] = None
    layout: Optional[str] = None
    has_carousel: bool
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


# ── LandingCard ──

class LandingCardCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class LandingCardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class LandingCardResponse(BaseModel):
    id: int
    section_id: int
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


# ── LandingServiceCard ──

class LandingServiceCardCreate(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class LandingServiceCardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class LandingServiceCardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}
