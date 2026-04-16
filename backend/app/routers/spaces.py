from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.hospital import SpaceImage
from app.core.security import get_current_user

router = APIRouter(tags=["spaces"])


@router.delete("/api/spaces/{space_id}", status_code=204)
async def delete_space(
    space_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(SpaceImage).where(SpaceImage.id == space_id))
    space = result.scalars().first()
    if not space:
        raise HTTPException(status_code=404, detail="공간 이미지를 찾을 수 없습니다.")

    await db.delete(space)
    await db.commit()
