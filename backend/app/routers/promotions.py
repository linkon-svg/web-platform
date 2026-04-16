from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.hospital import Promotion
from app.schemas.promotion import PromotionCreate, PromotionUpdate, PromotionResponse
from app.core.security import get_current_user

router = APIRouter(tags=["promotions"])


@router.get("/api/hospitals/{hospital_id}/promotions", response_model=List[PromotionResponse])
async def get_promotions(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Promotion).where(Promotion.hospital_id == hospital_id).order_by(Promotion.id)
    )
    return result.scalars().all()


@router.post("/api/hospitals/{hospital_id}/promotions", response_model=PromotionResponse, status_code=201)
async def create_promotion(
    hospital_id: int,
    data: PromotionCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    promotion = Promotion(
        hospital_id=hospital_id,
        title=data.title,
        image_url=data.image_url,
        start_date=data.start_date,
        end_date=data.end_date,
        is_active=data.is_active if data.is_active is not None else True,
    )
    db.add(promotion)
    await db.commit()
    await db.refresh(promotion)
    return promotion


@router.put("/api/promotions/{promotion_id}", response_model=PromotionResponse)
async def update_promotion(
    promotion_id: int,
    data: PromotionUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="프로모션을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(promotion, key, value)

    await db.commit()
    await db.refresh(promotion)
    return promotion


@router.delete("/api/promotions/{promotion_id}", status_code=204)
async def delete_promotion(
    promotion_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="프로모션을 찾을 수 없습니다.")

    await db.delete(promotion)
    await db.commit()
