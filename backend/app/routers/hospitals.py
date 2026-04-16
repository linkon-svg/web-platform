from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db
from app.models.hospital import Hospital, Schedule, Philosophy, SpaceImage
from app.schemas.hospital import (
    HospitalResponse, HospitalUpdate,
    ScheduleResponse, ScheduleUpdate,
)
from app.core.security import get_current_user

router = APIRouter(prefix="/api/hospitals", tags=["hospitals"])


# --- Inline schemas for philosophy & spaces ---

class PhilosophyItem(BaseModel):
    icon: Optional[str] = None
    title: str
    title_ko: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = 0


class PhilosophyResponse(BaseModel):
    id: int
    hospital_id: int
    icon: Optional[str] = None
    title: str
    title_ko: Optional[str] = None
    description: Optional[str] = None
    sort_order: int
    model_config = {"from_attributes": True}


class SpaceImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    sort_order: Optional[int] = 0


class SpaceImageResponse(BaseModel):
    id: int
    hospital_id: int
    image_url: str
    caption: Optional[str] = None
    sort_order: int
    model_config = {"from_attributes": True}


# --- Hospital ---

@router.get("/{hospital_id}", response_model=HospitalResponse)
async def get_hospital(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalars().first()
    if not hospital:
        raise HTTPException(status_code=404, detail="병원을 찾을 수 없습니다.")
    return hospital


@router.put("/{hospital_id}", response_model=HospitalResponse)
async def update_hospital(
    hospital_id: int,
    data: HospitalUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalars().first()
    if not hospital:
        raise HTTPException(status_code=404, detail="병원을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(hospital, key, value)

    await db.commit()
    await db.refresh(hospital)
    return hospital


# --- Schedule ---

@router.get("/{hospital_id}/schedule", response_model=ScheduleResponse)
async def get_schedule(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Schedule).where(Schedule.hospital_id == hospital_id))
    schedule = result.scalars().first()
    if not schedule:
        raise HTTPException(status_code=404, detail="진료시간 정보가 없습니다.")
    return schedule


@router.put("/{hospital_id}/schedule", response_model=ScheduleResponse)
async def update_schedule(
    hospital_id: int,
    data: ScheduleUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Schedule).where(Schedule.hospital_id == hospital_id))
    schedule = result.scalars().first()
    if not schedule:
        schedule = Schedule(hospital_id=hospital_id)
        db.add(schedule)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(schedule, key, value)

    await db.commit()
    await db.refresh(schedule)
    return schedule


# --- Philosophy ---

@router.get("/{hospital_id}/philosophy", response_model=List[PhilosophyResponse])
async def get_philosophy(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Philosophy).where(Philosophy.hospital_id == hospital_id).order_by(Philosophy.sort_order)
    )
    return result.scalars().all()


@router.put("/{hospital_id}/philosophy", response_model=List[PhilosophyResponse])
async def update_philosophy(
    hospital_id: int,
    items: List[PhilosophyItem],
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    # Delete existing
    result = await db.execute(select(Philosophy).where(Philosophy.hospital_id == hospital_id))
    for p in result.scalars().all():
        await db.delete(p)

    # Create new
    new_items = []
    for i, item in enumerate(items):
        p = Philosophy(
            hospital_id=hospital_id,
            icon=item.icon,
            title=item.title,
            title_ko=item.title_ko,
            description=item.description,
            sort_order=item.sort_order or i + 1,
        )
        db.add(p)
        new_items.append(p)

    await db.commit()
    for p in new_items:
        await db.refresh(p)
    return new_items


# --- Space Images ---

@router.get("/{hospital_id}/spaces", response_model=List[SpaceImageResponse])
async def get_spaces(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SpaceImage).where(SpaceImage.hospital_id == hospital_id).order_by(SpaceImage.sort_order)
    )
    return result.scalars().all()


@router.post("/{hospital_id}/spaces", response_model=SpaceImageResponse, status_code=201)
async def create_space(
    hospital_id: int,
    data: SpaceImageCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    space = SpaceImage(
        hospital_id=hospital_id,
        image_url=data.image_url,
        caption=data.caption,
        sort_order=data.sort_order or 0,
    )
    db.add(space)
    await db.commit()
    await db.refresh(space)
    return space
