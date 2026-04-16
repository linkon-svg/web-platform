from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다.",
        )

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
