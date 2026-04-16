from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.hospital import Treatment
from app.schemas.treatment import TreatmentCreate, TreatmentUpdate, TreatmentResponse
from app.core.security import get_current_user

router = APIRouter(tags=["treatments"])


@router.get("/api/hospitals/{hospital_id}/treatments", response_model=List[TreatmentResponse])
async def get_treatments(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Treatment).where(Treatment.hospital_id == hospital_id).order_by(Treatment.sort_order)
    )
    return result.scalars().all()


@router.post("/api/hospitals/{hospital_id}/treatments", response_model=TreatmentResponse, status_code=201)
async def create_treatment(
    hospital_id: int,
    data: TreatmentCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    treatment = Treatment(
        hospital_id=hospital_id,
        name=data.name,
        category=data.category,
        description=data.description,
        image_url=data.image_url,
        sort_order=data.sort_order or 0,
    )
    db.add(treatment)
    await db.commit()
    await db.refresh(treatment)
    return treatment


@router.put("/api/treatments/{treatment_id}", response_model=TreatmentResponse)
async def update_treatment(
    treatment_id: int,
    data: TreatmentUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Treatment).where(Treatment.id == treatment_id))
    treatment = result.scalars().first()
    if not treatment:
        raise HTTPException(status_code=404, detail="시술을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(treatment, key, value)

    await db.commit()
    await db.refresh(treatment)
    return treatment


@router.delete("/api/treatments/{treatment_id}", status_code=204)
async def delete_treatment(
    treatment_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Treatment).where(Treatment.id == treatment_id))
    treatment = result.scalars().first()
    if not treatment:
        raise HTTPException(status_code=404, detail="시술을 찾을 수 없습니다.")

    await db.delete(treatment)
    await db.commit()
