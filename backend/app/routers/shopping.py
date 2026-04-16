from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db
from app.models.shopping import Product, Category, ShopNews, Store, ShopConfig
from app.schemas.shopping import (
    ProductCreate, ProductUpdate, ProductResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
    ShopNewsCreate, ShopNewsUpdate, ShopNewsResponse,
    StoreCreate, StoreUpdate, StoreResponse,
    ShopConfigUpdate, ShopConfigResponse,
)
from app.core.security import get_current_user

router = APIRouter(tags=["shopping"])


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  ShopConfig
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/shopping/config", response_model=ShopConfigResponse)
async def get_shop_config(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ShopConfig))
    config = result.scalars().first()
    if not config:
        config = ShopConfig(shop_name="My Shop")
        db.add(config)
        await db.commit()
        await db.refresh(config)
    return config


@router.put("/api/shopping/config", response_model=ShopConfigResponse)
async def update_shop_config(
    data: ShopConfigUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(ShopConfig))
    config = result.scalars().first()
    if not config:
        config = ShopConfig(shop_name="My Shop")
        db.add(config)
        await db.flush()

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(config, key, value)

    await db.commit()
    await db.refresh(config)
    return config


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Categories
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/shopping/categories", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category).order_by(Category.sort_order)
    )
    return result.scalars().all()


@router.post("/api/shopping/categories", response_model=CategoryResponse, status_code=201)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    category = Category(**data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.put("/api/shopping/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalars().first()
    if not category:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/api/shopping/categories/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalars().first()
    if not category:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    await db.delete(category)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Products
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/shopping/products", response_model=List[ProductResponse])
async def get_products(
    category_id: Optional[int] = Query(None),
    is_new: Optional[bool] = Query(None),
    is_recommended: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).order_by(Product.sort_order)

    if category_id is not None:
        query = query.where(Product.category_id == category_id)
    if is_new is not None:
        query = query.where(Product.is_new == is_new)
    if is_recommended is not None:
        query = query.where(Product.is_recommended == is_recommended)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/api/shopping/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
    return product


@router.post("/api/shopping/products", response_model=ProductResponse, status_code=201)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


@router.put("/api/shopping/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/api/shopping/products/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")

    await db.delete(product)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  ShopNews
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/shopping/news", response_model=List[ShopNewsResponse])
async def get_shop_news(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ShopNews).order_by(ShopNews.created_at.desc())
    )
    return result.scalars().all()


@router.post("/api/shopping/news", response_model=ShopNewsResponse, status_code=201)
async def create_shop_news(
    data: ShopNewsCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    news = ShopNews(**data.model_dump())
    db.add(news)
    await db.commit()
    await db.refresh(news)
    return news


@router.put("/api/shopping/news/{news_id}", response_model=ShopNewsResponse)
async def update_shop_news(
    news_id: int,
    data: ShopNewsUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(ShopNews).where(ShopNews.id == news_id))
    news = result.scalars().first()
    if not news:
        raise HTTPException(status_code=404, detail="뉴스를 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(news, key, value)

    await db.commit()
    await db.refresh(news)
    return news


@router.delete("/api/shopping/news/{news_id}", status_code=204)
async def delete_shop_news(
    news_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(ShopNews).where(ShopNews.id == news_id))
    news = result.scalars().first()
    if not news:
        raise HTTPException(status_code=404, detail="뉴스를 찾을 수 없습니다.")

    await db.delete(news)
    await db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Stores
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/api/shopping/stores", response_model=List[StoreResponse])
async def get_stores(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Store).order_by(Store.sort_order)
    )
    return result.scalars().all()


@router.post("/api/shopping/stores", response_model=StoreResponse, status_code=201)
async def create_store(
    data: StoreCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    store = Store(**data.model_dump())
    db.add(store)
    await db.commit()
    await db.refresh(store)
    return store


@router.put("/api/shopping/stores/{store_id}", response_model=StoreResponse)
async def update_store(
    store_id: int,
    data: StoreUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalars().first()
    if not store:
        raise HTTPException(status_code=404, detail="매장을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(store, key, value)

    await db.commit()
    await db.refresh(store)
    return store


@router.delete("/api/shopping/stores/{store_id}", status_code=204)
async def delete_store(
    store_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalars().first()
    if not store:
        raise HTTPException(status_code=404, detail="매장을 찾을 수 없습니다.")

    await db.delete(store)
    await db.commit()
