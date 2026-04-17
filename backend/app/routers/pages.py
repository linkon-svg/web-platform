from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.site import Site, Page
from app.schemas.page import PageCreate, PageUpdate, PageResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/pages", tags=["pages"])


async def _get_user(db: AsyncSession, current_user: dict) -> User:
    result = await db.execute(select(User).where(User.email == current_user["email"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return user


async def _get_owned_page(db: AsyncSession, page_id: int, user: User) -> Page:
    result = await db.execute(select(Page).where(Page.id == page_id))
    page = result.scalars().first()
    if not page:
        raise HTTPException(status_code=404, detail="페이지를 찾을 수 없습니다.")
    result = await db.execute(select(Site).where(Site.id == page.site_id))
    site = result.scalars().first()
    if not site:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if site.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return page


@router.post("/", response_model=PageResponse, status_code=201)
async def create_page(
    data: PageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    result = await db.execute(select(Site).where(Site.id == data.site_id))
    site = result.scalars().first()
    if not site:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if site.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")

    page = Page(
        site_id=data.site_id,
        title=data.title,
        slug=data.slug,
        content=data.content,
        sort_order=data.sort_order,
        is_visible=data.is_visible,
    )
    db.add(page)
    await db.commit()
    await db.refresh(page)
    return page


@router.get("/site/{site_id}", response_model=List[PageResponse])
async def list_pages(
    site_id: int,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    result = await db.execute(select(Site).where(Site.id == site_id))
    site = result.scalars().first()
    if not site:
        raise HTTPException(status_code=404, detail="사이트를 찾을 수 없습니다.")
    if site.owner_id != user.id:
        raise HTTPException(status_code=403, detail="권한이 없습니다.")

    result = await db.execute(
        select(Page)
        .where(Page.site_id == site_id)
        .order_by(Page.sort_order)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{page_id}", response_model=PageResponse)
async def get_page(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    page = await _get_owned_page(db, page_id, user)
    return page


@router.put("/{page_id}", response_model=PageResponse)
async def update_page(
    page_id: int,
    data: PageUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    page = await _get_owned_page(db, page_id, user)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(page, key, value)

    await db.commit()
    await db.refresh(page)
    return page


@router.delete("/{page_id}")
async def delete_page(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)
    page = await _get_owned_page(db, page_id, user)

    await db.delete(page)
    await db.commit()
    return {"ok": True}
