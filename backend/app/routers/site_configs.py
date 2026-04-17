from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.site import Site, SiteConfig
from app.schemas.site_config import SiteConfigCreate, SiteConfigUpdate, SiteConfigResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/site-configs", tags=["site-configs"])


async def _get_user(db: AsyncSession, current_user: dict) -> User:
    result = await db.execute(select(User).where(User.email == current_user["email"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return user


async def _get_owned_site(db: AsyncSession, site_id: int, user: User) -> Site:
    result = await db.execute(select(Site).where(Site.id == site_id))
    site = result.scalars().first()
    if not site:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if site.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return site


@router.post("/", response_model=SiteConfigResponse, status_code=201)
async def create_site_config(
    data: SiteConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    await _get_owned_site(db, data.site_id, user)

    result = await db.execute(
        select(SiteConfig).where(SiteConfig.site_id == data.site_id)
    )
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="이미 설정이 존재합니다.")

    config = SiteConfig(**data.model_dump())
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return config


@router.get("/site/{site_id}", response_model=SiteConfigResponse)
async def get_site_config(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    await _get_owned_site(db, site_id, user)

    result = await db.execute(
        select(SiteConfig).where(SiteConfig.site_id == site_id)
    )
    config = result.scalars().first()
    if not config:
        raise HTTPException(status_code=404, detail="사이트 설정을 찾을 수 없습니다.")
    return config


@router.put("/site/{site_id}", response_model=SiteConfigResponse)
async def update_site_config(
    site_id: int,
    data: SiteConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    await _get_owned_site(db, site_id, user)

    result = await db.execute(
        select(SiteConfig).where(SiteConfig.site_id == site_id)
    )
    config = result.scalars().first()

    if config:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(config, key, value)
    else:
        config = SiteConfig(site_id=site_id, **data.model_dump(exclude_unset=True))
        db.add(config)

    await db.commit()
    await db.refresh(config)
    return config


@router.delete("/site/{site_id}")
async def delete_site_config(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    await _get_owned_site(db, site_id, user)

    result = await db.execute(
        select(SiteConfig).where(SiteConfig.site_id == site_id)
    )
    config = result.scalars().first()
    if not config:
        raise HTTPException(status_code=404, detail="사이트 설정을 찾을 수 없습니다.")

    await db.delete(config)
    await db.commit()
    return {"ok": True}
