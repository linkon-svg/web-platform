from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routers import auth, hospitals, doctors, treatments, promotions, spaces, uploads, shopping, corporate, landing


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Web Platform API",
    description="웹사이트 템플릿 시스템 백엔드 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(hospitals.router)
app.include_router(doctors.router)
app.include_router(treatments.router)
app.include_router(promotions.router)
app.include_router(spaces.router)
app.include_router(uploads.router)
app.include_router(shopping.router)
app.include_router(corporate.router)
app.include_router(landing.router)

# Static file serving for uploads (must be after router includes)
_uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
_uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(_uploads_dir)), name="uploads")


@app.get("/")
async def root():
    return {"message": "Web Platform API", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
