import os
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel

from app.core.security import get_current_user

router = APIRouter(tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
ALLOWED_CATEGORIES = {
    # Hospital template
    "hero", "doctors", "spaces", "treatments", "promotions",
    # General platform
    "general", "sites", "logos", "banners", "products", "portfolios", "backgrounds",
}
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class UploadResponse(BaseModel):
    url: str
    filename: str


class DeleteRequest(BaseModel):
    url: str


class FileItem(BaseModel):
    url: str
    filename: str


def _validate_category(category: str) -> Path:
    if category not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"허용되지 않는 카테고리입니다. 허용: {', '.join(sorted(ALLOWED_CATEGORIES))}",
        )
    category_dir = UPLOAD_DIR / category
    category_dir.mkdir(parents=True, exist_ok=True)
    return category_dir


def _get_extension(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"허용되지 않는 파일 형식입니다. 허용: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )
    return ext


@router.post("/api/upload/{category}", response_model=UploadResponse)
async def upload_file(
    category: str,
    file: UploadFile = File(...),
    _=Depends(get_current_user),
):
    """이미지 파일을 업로드합니다. JWT 인증 필수."""
    category_dir = _validate_category(category)
    ext = _get_extension(file.filename or "unknown.jpg")

    # Read file and check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"파일 크기가 10MB를 초과합니다. ({len(content) / 1024 / 1024:.1f}MB)",
        )

    # Generate UUID filename
    new_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = category_dir / new_filename

    # Write file
    with open(file_path, "wb") as f:
        f.write(content)

    url = f"/uploads/{category}/{new_filename}"
    return UploadResponse(url=url, filename=file.filename or new_filename)


@router.delete("/api/upload")
async def delete_file(
    data: DeleteRequest,
    _=Depends(get_current_user),
):
    """업로드된 이미지를 삭제합니다. JWT 인증 필수."""
    # Sanitize path to prevent directory traversal
    url = data.url
    if not url.startswith("/uploads/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="올바르지 않은 파일 경로입니다.",
        )

    relative_path = url.removeprefix("/uploads/")
    file_path = (UPLOAD_DIR / relative_path).resolve()

    # Ensure resolved path is still within UPLOAD_DIR
    if not str(file_path).startswith(str(UPLOAD_DIR.resolve())):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="올바르지 않은 파일 경로입니다.",
        )

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다.",
        )

    os.remove(file_path)
    return {"message": "파일이 삭제되었습니다.", "url": url}


@router.get("/api/upload/{category}", response_model=List[FileItem])
async def list_files(category: str):
    """카테고리별 업로드된 이미지 목록을 반환합니다."""
    category_dir = _validate_category(category)

    files = []
    for item in sorted(category_dir.iterdir()):
        if item.is_file() and item.name != ".gitkeep":
            files.append(FileItem(
                url=f"/uploads/{category}/{item.name}",
                filename=item.name,
            ))

    return files
