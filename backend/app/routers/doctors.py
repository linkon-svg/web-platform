from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.hospital import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse
from app.core.security import get_current_user

router = APIRouter(tags=["doctors"])


@router.get("/api/hospitals/{hospital_id}/doctors", response_model=List[DoctorResponse])
async def get_doctors(hospital_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Doctor).where(Doctor.hospital_id == hospital_id).order_by(Doctor.sort_order)
    )
    return result.scalars().all()


@router.post("/api/hospitals/{hospital_id}/doctors", response_model=DoctorResponse, status_code=201)
async def create_doctor(
    hospital_id: int,
    data: DoctorCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    doctor = Doctor(
        hospital_id=hospital_id,
        name=data.name,
        title=data.title,
        photo_url=data.photo_url,
        education=data.education,
        career=data.career,
        sort_order=data.sort_order or 0,
    )
    db.add(doctor)
    await db.commit()
    await db.refresh(doctor)
    return doctor


@router.put("/api/doctors/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
    doctor_id: int,
    data: DoctorUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalars().first()
    if not doctor:
        raise HTTPException(status_code=404, detail="의료진을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doctor, key, value)

    await db.commit()
    await db.refresh(doctor)
    return doctor


@router.delete("/api/doctors/{doctor_id}", status_code=204)
async def delete_doctor(
    doctor_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalars().first()
    if not doctor:
        raise HTTPException(status_code=404, detail="의료진을 찾을 수 없습니다.")

    await db.delete(doctor)
    await db.commit()
