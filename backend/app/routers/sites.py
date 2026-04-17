from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User
from app.models.site import Site, Page, SiteConfig, Template
from app.schemas.site import SiteCreate, SiteUpdate, SiteResponse, SiteDetailResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/sites", tags=["sites"])


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


@router.post("/", response_model=SiteResponse, status_code=201)
async def create_site(
    data: SiteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)

    # Check slug uniqueness
    existing = await db.execute(select(Site).where(Site.slug == data.slug))
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="이미 사용 중인 슬러그입니다.")

    # Check template exists
    template = await db.execute(select(Template).where(Template.id == data.template_id))
    if not template.scalars().first():
        raise HTTPException(status_code=404, detail="템플릿을 찾을 수 없습니다.")

    site = Site(
        name=data.name,
        slug=data.slug,
        template_id=data.template_id,
        owner_id=user.id,
    )
    db.add(site)
    await db.commit()
    await db.refresh(site)
    return site


@router.get("/", response_model=List[SiteResponse])
async def list_sites(
    skip: int = 0,
    limit: int = 20,
    search: str = "",
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    query = select(Site).where(Site.owner_id == user.id)
    if search:
        query = query.where(or_(Site.name.ilike(f"%{search}%"), Site.slug.ilike(f"%{search}%")))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{site_id}", response_model=SiteDetailResponse)
async def get_site(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    result = await db.execute(
        select(Site)
        .where(Site.id == site_id)
        .options(
            selectinload(Site.template),
            selectinload(Site.pages),
            selectinload(Site.config),
        )
    )
    site = result.scalars().first()
    if not site:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if site.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return site


@router.put("/{site_id}", response_model=SiteResponse)
async def update_site(
    site_id: int,
    data: SiteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    site = await _get_owned_site(db, site_id, user)

    update_data = data.model_dump(exclude_unset=True)

    # Check slug uniqueness if slug is being updated
    if "slug" in update_data:
        existing = await db.execute(
            select(Site).where(and_(Site.slug == update_data["slug"], Site.id != site_id))
        )
        if existing.scalars().first():
            raise HTTPException(status_code=409, detail="이미 사용 중인 슬러그입니다.")

    for key, value in update_data.items():
        setattr(site, key, value)

    await db.commit()
    await db.refresh(site)
    return site


@router.delete("/{site_id}")
async def delete_site(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    site = await _get_owned_site(db, site_id, user)

    await db.delete(site)
    await db.commit()
    return {"ok": True}


@router.post("/{site_id}/clone", response_model=SiteDetailResponse, status_code=201)
async def clone_site(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)

    # Load source site with pages and config
    result = await db.execute(
        select(Site)
        .where(Site.id == site_id)
        .options(
            selectinload(Site.pages),
            selectinload(Site.config),
        )
    )
    source = result.scalars().first()
    if not source:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if source.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")

    # Create cloned site
    new_site = Site(
        name=f"{source.name} (복사본)",
        slug=f"{source.slug}-copy-{uuid4().hex[:8]}",
        template_id=source.template_id,
        owner_id=user.id,
    )
    db.add(new_site)
    await db.flush()

    # Clone pages
    for page in source.pages:
        new_page = Page(
            site_id=new_site.id,
            title=page.title,
            slug=page.slug,
            content=page.content,
            sort_order=page.sort_order,
            is_visible=page.is_visible,
        )
        db.add(new_page)

    # Clone config
    if source.config:
        new_config = SiteConfig(
            site_id=new_site.id,
            logo_url=source.config.logo_url,
            primary_color=source.config.primary_color,
            secondary_color=source.config.secondary_color,
            font_family=source.config.font_family,
            meta_title=source.config.meta_title,
            meta_description=source.config.meta_description,
            custom_css=source.config.custom_css,
            extra_settings=source.config.extra_settings,
        )
        db.add(new_config)

    await db.commit()

    # Reload with relationships for response
    result = await db.execute(
        select(Site)
        .where(Site.id == new_site.id)
        .options(
            selectinload(Site.template),
            selectinload(Site.pages),
            selectinload(Site.config),
        )
    )
    return result.scalars().first()


@router.patch("/{site_id}/publish", response_model=SiteResponse)
async def publish_site(
    site_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    site = await _get_owned_site(db, site_id, user)

    site.is_published = not site.is_published
    await db.commit()
    await db.refresh(site)
    return site
