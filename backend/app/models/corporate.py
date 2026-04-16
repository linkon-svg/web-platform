from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from app.database import Base


class CorporateConfig(Base):
    __tablename__ = "corporate_configs"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False, default="My Company")
    company_name_en = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    logo_dark = Column(String, nullable=True)
    hero_type = Column(String, nullable=True, default="image")
    hero_media = Column(String, nullable=True)
    hero_slides = Column(JSON, nullable=True)
    vision_title = Column(String, nullable=True)
    vision_description = Column(Text, nullable=True)
    mission_title = Column(String, nullable=True)
    mission_description = Column(Text, nullable=True)
    about_content = Column(Text, nullable=True)
    footer_info = Column(JSON, nullable=True)
    sns_links = Column(JSON, nullable=True)
    dark_mode_default = Column(Boolean, default=False)
    language_options = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class CorporateService(Base):
    __tablename__ = "corporate_services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    title_en = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    link = Column(String, nullable=True)
    image = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


class CorporateNews(Base):
    __tablename__ = "corporate_news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    summary = Column(String, nullable=True)
    image = Column(String, nullable=True)
    category = Column(String, nullable=True, default="뉴스")
    is_featured = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class CorporateTeam(Base):
    __tablename__ = "corporate_teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    link = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


class CorporateCareer(Base):
    __tablename__ = "corporate_careers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    link = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class CorporateMilestone(Base):
    __tablename__ = "corporate_milestones"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
