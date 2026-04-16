from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    name_en = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    business_number = Column(String, nullable=True)
    ceo = Column(String, nullable=True)
    hero_image_url = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    doctors = relationship("Doctor", back_populates="hospital", cascade="all, delete-orphan")
    schedules = relationship("Schedule", back_populates="hospital", cascade="all, delete-orphan")
    treatments = relationship("Treatment", back_populates="hospital", cascade="all, delete-orphan")
    promotions = relationship("Promotion", back_populates="hospital", cascade="all, delete-orphan")
    philosophies = relationship("Philosophy", back_populates="hospital", cascade="all, delete-orphan")
    space_images = relationship("SpaceImage", back_populates="hospital", cascade="all, delete-orphan")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)  # 대표원장/부원장/원장
    photo_url = Column(String, nullable=True)
    education = Column(JSON, nullable=True)
    career = Column(JSON, nullable=True)
    sort_order = Column(Integer, default=0)

    hospital = relationship("Hospital", back_populates="doctors")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    weekday = Column(String, nullable=True)
    saturday = Column(String, nullable=True)
    sunday = Column(String, nullable=True)
    holiday = Column(String, nullable=True)
    lunch_time = Column(String, nullable=True)

    hospital = relationship("Hospital", back_populates="schedules")


class Treatment(Base):
    __tablename__ = "treatments"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)

    hospital = relationship("Hospital", back_populates="treatments")


class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)

    hospital = relationship("Hospital", back_populates="promotions")


class Philosophy(Base):
    __tablename__ = "philosophies"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    icon = Column(String, nullable=True)
    title = Column(String, nullable=False)
    title_ko = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    hospital = relationship("Hospital", back_populates="philosophies")


class SpaceImage(Base):
    __tablename__ = "space_images"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)

    hospital = relationship("Hospital", back_populates="space_images")
