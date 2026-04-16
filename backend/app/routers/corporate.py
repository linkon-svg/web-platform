from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db
from app.models.corporate import (
    CorporateConfig, CorporateService, CorporateNews,
    CorporateTeam, CorporateCareer, CorporateMilestone,
)
from app.schemas.corporate import (
    CorporateConfigUpdate, CorporateConfigResponse,
    CorporateServiceCreate, CorporateServiceUpdate, CorporateServiceResponse,
    CorporateNewsCreate, CorporateNewsUpdate, CorporateNewsResponse,
    CorporateTeamCreate, CorporateTeamUpdate, CorporateTeamResponse,
    CorporateCareerCreate, CorporateCareerUpdate, CorporateCareerResponse,
    CorporateMilestoneCreate, CorporateMilestoneUpdate, CorporateMilestoneResponse,
)
from app.core.security import get_current_user

router = APIRouter(tags=["corporate"])


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  CorporateConfig
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/config", response_model=CorporateConfigResponse)
async def get_corporate_config(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateConfig))
    config = result.scalars().first()
    if not config:
        config = CorporateConfig(company_name="My Company")
        db.add(config)
        await db.commit()
        await db.refresh(config)
    return config


@router.put("/api/corporate/config", response_model=CorporateConfigResponse)
async def update_corporate_config(
    data: CorporateConfigUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(CorporateConfig))
    config = result.scalars().first()
    if not config:
        config = CorporateConfig(company_name="My Company")
        db.add(config)
        await db.flush()

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(config, key, value)

    await db.commit()
    await db.refresh(config)
    return config


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Services
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/services", response_model=List[CorporateServiceResponse])
async def get_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateService).order_by(CorporateService.sort_order))
    return result.scalars().all()


@router.post("/api/corporate/services", response_model=CorporateServiceResponse, status_code=201)
async def create_service(data: CorporateServiceCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = CorporateService(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/corporate/services/{item_id}", response_model=CorporateServiceResponse)
async def update_service(item_id: int, data: CorporateServiceUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateService).where(CorporateService.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="서비스를 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/corporate/services/{item_id}", status_code=204)
async def delete_service(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateService).where(CorporateService.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="서비스를 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  News
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/news", response_model=List[CorporateNewsResponse])
async def get_news(
    category: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(CorporateNews).order_by(CorporateNews.created_at.desc())
    if category:
        query = query.where(CorporateNews.category == category)
    if is_featured is not None:
        query = query.where(CorporateNews.is_featured == is_featured)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/api/corporate/news/{item_id}", response_model=CorporateNewsResponse)
async def get_news_detail(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateNews).where(CorporateNews.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="뉴스를 찾을 수 없습니다.")
    return item


@router.post("/api/corporate/news", response_model=CorporateNewsResponse, status_code=201)
async def create_news(data: CorporateNewsCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = CorporateNews(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/corporate/news/{item_id}", response_model=CorporateNewsResponse)
async def update_news(item_id: int, data: CorporateNewsUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateNews).where(CorporateNews.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="뉴스를 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/corporate/news/{item_id}", status_code=204)
async def delete_news(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateNews).where(CorporateNews.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="뉴스를 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Teams
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/teams", response_model=List[CorporateTeamResponse])
async def get_teams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateTeam).order_by(CorporateTeam.sort_order))
    return result.scalars().all()


@router.post("/api/corporate/teams", response_model=CorporateTeamResponse, status_code=201)
async def create_team(data: CorporateTeamCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = CorporateTeam(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/corporate/teams/{item_id}", response_model=CorporateTeamResponse)
async def update_team(item_id: int, data: CorporateTeamUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateTeam).where(CorporateTeam.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="팀을 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/corporate/teams/{item_id}", status_code=204)
async def delete_team(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateTeam).where(CorporateTeam.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="팀을 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Careers
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/careers", response_model=List[CorporateCareerResponse])
async def get_careers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateCareer).order_by(CorporateCareer.created_at.desc()))
    return result.scalars().all()


@router.post("/api/corporate/careers", response_model=CorporateCareerResponse, status_code=201)
async def create_career(data: CorporateCareerCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = CorporateCareer(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/corporate/careers/{item_id}", response_model=CorporateCareerResponse)
async def update_career(item_id: int, data: CorporateCareerUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateCareer).where(CorporateCareer.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="채용 정보를 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/corporate/careers/{item_id}", status_code=204)
async def delete_career(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateCareer).where(CorporateCareer.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="채용 정보를 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Milestones
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/corporate/milestones", response_model=List[CorporateMilestoneResponse])
async def get_milestones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CorporateMilestone).order_by(CorporateMilestone.year.desc(), CorporateMilestone.sort_order))
    return result.scalars().all()


@router.post("/api/corporate/milestones", response_model=CorporateMilestoneResponse, status_code=201)
async def create_milestone(data: CorporateMilestoneCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = CorporateMilestone(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/api/corporate/milestones/{item_id}", response_model=CorporateMilestoneResponse)
async def update_milestone(item_id: int, data: CorporateMilestoneUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateMilestone).where(CorporateMilestone.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="연혁을 찾을 수 없습니다.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/api/corporate/milestones/{item_id}", status_code=204)
async def delete_milestone(item_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(CorporateMilestone).where(CorporateMilestone.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="연혁을 찾을 수 없습니다.")
    await db.delete(item)
    await db.commit()
