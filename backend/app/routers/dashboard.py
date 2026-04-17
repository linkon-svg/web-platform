from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.user import User
from app.models.site import Site, Page, Template
from app.schemas.site import SiteResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


class TemplateSiteCount(BaseModel):
    template_name: str
    display_name: str
    count: int


class DashboardStatsResponse(BaseModel):
    total_sites: int
    published_sites: int
    draft_sites: int
    total_pages: int
    sites_by_template: List[TemplateSiteCount]
    recent_sites: List[SiteResponse]


async def _get_user(db: AsyncSession, current_user: dict) -> User:
    result = await db.execute(select(User).where(User.email == current_user["email"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return user


@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user = await _get_user(db, current_user)

    # Count total / published / draft sites
    total_result = await db.execute(
        select(func.count(Site.id)).where(Site.owner_id == user.id)
    )
    total_sites = total_result.scalar() or 0

    published_result = await db.execute(
        select(func.count(Site.id)).where(
            Site.owner_id == user.id, Site.is_published == True
        )
    )
    published_sites = published_result.scalar() or 0

    draft_sites = total_sites - published_sites

    # Count total pages across all user's sites
    pages_result = await db.execute(
        select(func.count(Page.id))
        .select_from(Page)
        .join(Site, Page.site_id == Site.id)
        .where(Site.owner_id == user.id)
    )
    total_pages = pages_result.scalar() or 0

    # Count sites per template
    template_result = await db.execute(
        select(
            Template.name,
            Template.display_name,
            func.count(Site.id).label("count"),
        )
        .select_from(Template)
        .outerjoin(Site, (Site.template_id == Template.id) & (Site.owner_id == user.id))
        .group_by(Template.id, Template.name, Template.display_name)
    )
    sites_by_template = [
        TemplateSiteCount(template_name=row.name, display_name=row.display_name, count=row.count)
        for row in template_result.all()
    ]

    # Last 5 created sites
    recent_result = await db.execute(
        select(Site)
        .where(Site.owner_id == user.id)
        .order_by(Site.created_at.desc())
        .limit(5)
    )
    recent_sites = recent_result.scalars().all()

    return DashboardStatsResponse(
        total_sites=total_sites,
        published_sites=published_sites,
        draft_sites=draft_sites,
        total_pages=total_pages,
        sites_by_template=sites_by_template,
        recent_sites=recent_sites,
    )
