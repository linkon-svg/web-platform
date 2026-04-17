from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.landing import LandingConfig, LandingSection, LandingCard, LandingServiceCard
from app.schemas.landing import (
    LandingConfigUpdate, LandingConfigResponse,
    LandingSectionCreate, LandingSectionUpdate, LandingSectionResponse,
    LandingCardCreate, LandingCardUpdate, LandingCardResponse,
    LandingServiceCardCreate, LandingServiceCardUpdate, LandingServiceCardResponse,
)
from app.core.security import get_current_user

router = APIRouter(tags=["landing"])


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  LandingConfig
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/landing/config", response_model=LandingConfigResponse)
async def get_landing_config(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LandingConfig))
    config = result.scalars().first()
    if not config:
        config = LandingConfig(site_name="My Landing")
        db.add(config)
        await db.commit()
        await db.refresh(config)
    return config


@router.put("/api/landing/config", response_model=LandingConfigResponse)
async def update_landing_config(data: LandingConfigUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingConfig))
    config = result.scalars().first()
    if not config:
        config = LandingConfig(site_name="My Landing")
        db.add(config)
        await db.flush()
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(config, key, value)
    await db.commit()
    await db.refresh(config)
    return config


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Sections
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/landing/sections", response_model=List[LandingSectionResponse])
async def get_sections(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LandingSection).order_by(LandingSection.sort_order))
    return result.scalars().all()


@router.post("/api/landing/sections", response_model=LandingSectionResponse, status_code=201)
async def create_section(data: LandingSectionCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = LandingSection(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/landing/sections/{item_id}", response_model=LandingSectionResponse)
async def update_section(item_id: int, data: LandingSectionUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingSection).where(LandingSection.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="섹션을 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/landing/sections/{item_id}", status_code=204)
async def delete_section(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingSection).where(LandingSection.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="섹션을 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Cards (per section)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/landing/sections/{section_id}/cards", response_model=List[LandingCardResponse])
async def get_section_cards(section_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LandingCard).where(LandingCard.section_id == section_id).order_by(LandingCard.sort_order))
    return result.scalars().all()


@router.post("/api/landing/sections/{section_id}/cards", response_model=LandingCardResponse, status_code=201)
async def create_card(section_id: int, data: LandingCardCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = LandingCard(section_id=section_id, **data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/landing/cards/{item_id}", response_model=LandingCardResponse)
async def update_card(item_id: int, data: LandingCardUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingCard).where(LandingCard.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="카드를 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/landing/cards/{item_id}", status_code=204)
async def delete_card(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingCard).where(LandingCard.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="카드를 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Service Cards
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/landing/services", response_model=List[LandingServiceCardResponse])
async def get_service_cards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LandingServiceCard).order_by(LandingServiceCard.sort_order))
    return result.scalars().all()


@router.post("/api/landing/services", response_model=LandingServiceCardResponse, status_code=201)
async def create_service_card(data: LandingServiceCardCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = LandingServiceCard(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/landing/services/{item_id}", response_model=LandingServiceCardResponse)
async def update_service_card(item_id: int, data: LandingServiceCardUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingServiceCard).where(LandingServiceCard.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="서비스 카드를 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/landing/services/{item_id}", status_code=204)
async def delete_service_card(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(LandingServiceCard).where(LandingServiceCard.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="서비스 카드를 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()
