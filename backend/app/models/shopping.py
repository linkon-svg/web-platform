from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ShopConfig(Base):
    __tablename__ = "shop_configs"

    id = Column(Integer, primary_key=True, index=True)
    shop_name = Column(String, nullable=False, default="My Shop")
    shop_name_en = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    hero_image = Column(String, nullable=True)
    hero_title = Column(String, nullable=True)
    hero_subtitle = Column(String, nullable=True)
    season_banner_image = Column(String, nullable=True)
    season_banner_title = Column(String, nullable=True)
    season_banner_subtitle = Column(String, nullable=True)
    promo_text = Column(String, nullable=True, default="전 상품 무료 배송 & 무료 반품")
    about_content = Column(Text, nullable=True)
    about_images = Column(JSON, nullable=True)
    footer_info = Column(JSON, nullable=True)
    sns_links = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Category(Base):
    __tablename__ = "shop_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "shop_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False, default=0)
    sale_price = Column(Integer, nullable=True)
    category_id = Column(Integer, ForeignKey("shop_categories.id"), nullable=True)
    images = Column(JSON, nullable=True)
    thumbnail = Column(String, nullable=True)
    is_new = Column(Boolean, default=False)
    is_recommended = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category = relationship("Category", back_populates="products")


class ShopNews(Base):
    __tablename__ = "shop_news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    category = Column(String, nullable=True, default="소식")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Store(Base):
    __tablename__ = "shop_stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    region = Column(String, nullable=True, default="국내")
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
