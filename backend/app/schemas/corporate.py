from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# ── CorporateConfig ──

class CorporateConfigUpdate(BaseModel):
    company_name: Optional[str] = None
    company_name_en: Optional[str] = None
    logo: Optional[str] = None
    logo_dark: Optional[str] = None
    hero_type: Optional[str] = None
    hero_media: Optional[str] = None
    hero_slides: Optional[Any] = None
    vision_title: Optional[str] = None
    vision_description: Optional[str] = None
    mission_title: Optional[str] = None
    mission_description: Optional[str] = None
    about_content: Optional[str] = None
    footer_info: Optional[Any] = None
    sns_links: Optional[Any] = None
    dark_mode_default: Optional[bool] = None
    language_options: Optional[List[str]] = None


class CorporateConfigResponse(BaseModel):
    id: int
    company_name: str
    company_name_en: Optional[str] = None
    logo: Optional[str] = None
    logo_dark: Optional[str] = None
    hero_type: Optional[str] = None
    hero_media: Optional[str] = None
    hero_slides: Optional[Any] = None
    vision_title: Optional[str] = None
    vision_description: Optional[str] = None
    mission_title: Optional[str] = None
    mission_description: Optional[str] = None
    about_content: Optional[str] = None
    footer_info: Optional[Any] = None
    sns_links: Optional[Any] = None
    dark_mode_default: bool
    language_options: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── CorporateService ──

class CorporateServiceCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class CorporateServiceUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CorporateServiceResponse(BaseModel):
    id: int
    title: str
    title_en: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    image: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


# ── CorporateNews ──

class CorporateNewsCreate(BaseModel):
    title: str
    content: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = "뉴스"
    is_featured: Optional[bool] = False
    published_at: Optional[datetime] = None
    is_active: Optional[bool] = True


class CorporateNewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    published_at: Optional[datetime] = None
    is_active: Optional[bool] = None


class CorporateNewsResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    is_featured: bool
    published_at: Optional[datetime] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── CorporateTeam ──

class CorporateTeamCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class CorporateTeamUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CorporateTeamResponse(BaseModel):
    id: int
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


# ── CorporateCareer ──

class CorporateCareerCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    is_active: Optional[bool] = True


class CorporateCareerUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    is_active: Optional[bool] = None


class CorporateCareerResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── CorporateMilestone ──

class CorporateMilestoneCreate(BaseModel):
    year: int
    month: Optional[int] = None
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class CorporateMilestoneUpdate(BaseModel):
    year: Optional[int] = None
    month: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CorporateMilestoneResponse(BaseModel):
    id: int
    year: int
    month: Optional[int] = None
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}
