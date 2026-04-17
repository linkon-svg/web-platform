from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class LandingConfig(Base):
    __tablename__ = "landing_configs"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, nullable=False, default="My Landing")
    logo = Column(String, nullable=True)
    promo_bar_text = Column(String, nullable=True)
    promo_bar_link = Column(String, nullable=True)
    promo_bar_active = Column(Boolean, default=True)
    hero_title = Column(String, nullable=True)
    hero_subtitle = Column(String, nullable=True)
    hero_cta_text = Column(String, nullable=True)
    hero_cta_link = Column(String, nullable=True)
    hero_background = Column(String, nullable=True)
    footer_company_name = Column(String, nullable=True)
    footer_ceo = Column(String, nullable=True)
    footer_address = Column(String, nullable=True)
    footer_phone = Column(String, nullable=True)
    footer_email = Column(String, nullable=True)
    footer_business_number = Column(String, nullable=True)
    footer_links = Column(JSON, nullable=True)
    sns_links = Column(JSON, nullable=True)
    app_download_links = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class LandingSection(Base):
    __tablename__ = "landing_sections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    title_image = Column(String, nullable=True)
    heading = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    cta_text = Column(String, nullable=True)
    cta_link = Column(String, nullable=True)
    background_image = Column(String, nullable=True)
    background_color = Column(String, nullable=True)
    layout = Column(String, nullable=True, default="left-text")
    has_carousel = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    cards = relationship("LandingCard", back_populates="section", cascade="all, delete-orphan")


class LandingCard(Base):
    __tablename__ = "landing_cards"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("landing_sections.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    link = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    section = relationship("LandingSection", back_populates="cards")


class LandingServiceCard(Base):
    __tablename__ = "landing_service_cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    link = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
