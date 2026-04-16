from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# ── Category ──

class CategoryCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


# ── Product ──

class ProductCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    price: int = 0
    sale_price: Optional[int] = None
    category_id: Optional[int] = None
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    is_new: Optional[bool] = False
    is_recommended: Optional[bool] = False
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    sale_price: Optional[int] = None
    category_id: Optional[int] = None
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    is_new: Optional[bool] = None
    is_recommended: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    price: int
    sale_price: Optional[int] = None
    category_id: Optional[int] = None
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    is_new: bool
    is_recommended: bool
    is_active: bool
    sort_order: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── ShopNews ──

class ShopNewsCreate(BaseModel):
    title: str
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = "소식"
    is_active: Optional[bool] = True


class ShopNewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None


class ShopNewsResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── Store ──

class StoreCreate(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = "국내"
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class StoreResponse(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class ProductPaginatedResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ── ShopConfig ──

class ShopConfigUpdate(BaseModel):
    shop_name: Optional[str] = None
    shop_name_en: Optional[str] = None
    logo: Optional[str] = None
    hero_image: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    season_banner_image: Optional[str] = None
    season_banner_title: Optional[str] = None
    season_banner_subtitle: Optional[str] = None
    promo_text: Optional[str] = None
    about_content: Optional[str] = None
    about_images: Optional[List[str]] = None
    footer_info: Optional[Any] = None
    sns_links: Optional[Any] = None


class ShopConfigResponse(BaseModel):
    id: int
    shop_name: str
    shop_name_en: Optional[str] = None
    logo: Optional[str] = None
    hero_image: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    season_banner_image: Optional[str] = None
    season_banner_title: Optional[str] = None
    season_banner_subtitle: Optional[str] = None
    promo_text: Optional[str] = None
    about_content: Optional[str] = None
    about_images: Optional[List[str]] = None
    footer_info: Optional[Any] = None
    sns_links: Optional[Any] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
