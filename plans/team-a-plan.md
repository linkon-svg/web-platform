# Team A — Shopping 템플릿 (쇼핑몰/이커머스)

> 레퍼런스: 솔리드옴므 (solidhomme.com)
> 워크트리: 별도 브랜치에서 작업

---

## 담당 범위

Shopping 템플릿의 **백엔드 모델/API + 어드민 페이지 + 프론트엔드 백엔드 연동** 전체

---

## 현재 상태 (이미 완료된 것)

### 프론트엔드 페이지 (샘플 데이터로 구현됨)
- `/templates/shopping` — 메인 페이지 (프로모 배너, 히어로, 신상품 캐러셀, 시즌 배너, 추천상품, 카테고리 배너, 뉴스 캐러셀)
- `/templates/shopping/shop` — 상품 목록 페이지
- `/templates/shopping/product/[id]` — 상품 상세 페이지
- `/templates/shopping/about` — 브랜드 소개 페이지
- `/templates/shopping/news` — 뉴스 페이지
- `/templates/shopping/stores` — 매장 안내 페이지

### 프론트엔드 컴포넌트 (10개)
- ShopHeader, ShopFooter, ProductCard, ProductGrid
- CategoryBanner, SeasonBanner, PromoBanner
- NewsCarousel, NewsletterForm

---

## 작업 목록

### Step 1: 백엔드 — DB 모델 생성

**파일: `backend/app/models/shopping.py`**

```
Product (상품)
├── id: int (PK)
├── site_id: int (FK → sites)
├── name: str
├── name_en: str (optional)
├── description: text
├── price: int
├── sale_price: int (optional)
├── category_id: int (FK → categories)
├── images: JSON (이미지 URL 배열)
├── thumbnail: str (대표 이미지)
├── is_new: bool (신상품 여부)
├── is_recommended: bool (추천 여부)
├── is_active: bool
├── sort_order: int
├── created_at: datetime
└── updated_at: datetime

Category (카테고리)
├── id: int (PK)
├── site_id: int (FK)
├── name: str
├── name_en: str (optional)
├── description: str
├── image: str (카테고리 배너 이미지)
├── sort_order: int
└── is_active: bool

ShopNews (뉴스/캠페인)
├── id: int (PK)
├── site_id: int (FK)
├── title: str
├── content: text
├── image: str
├── category: str (소식/캠페인)
├── is_active: bool
├── created_at: datetime
└── updated_at: datetime

Store (매장)
├── id: int (PK)
├── site_id: int (FK)
├── name: str
├── address: str
├── phone: str
├── region: str (국내/해외)
├── sort_order: int
└── is_active: bool

ShopConfig (쇼핑몰 설정)
├── id: int (PK)
├── site_id: int (FK, unique)
├── shop_name: str
├── logo: str
├── hero_image: str
├── hero_title: str
├── hero_subtitle: str
├── season_banner_image: str
├── season_banner_title: str
├── season_banner_subtitle: str
├── promo_text: str ("전 상품 무료 배송 & 무료 반품")
├── about_content: text
├── about_images: JSON
├── footer_info: JSON (사업자 정보)
└── sns_links: JSON (인스타, 유튜브 등)
```

### Step 2: 백엔드 — Pydantic 스키마

**파일: `backend/app/schemas/shopping.py`**

각 모델에 대해:
- `Create` 스키마 (입력용)
- `Update` 스키마 (수정용, 모든 필드 Optional)
- `Response` 스키마 (응답용, id + timestamps 포함)
- `List` 스키마 (목록 응답용)

### Step 3: 백엔드 — API 라우터

**파일: `backend/app/routers/shopping.py`**

```
# 상품 API
GET    /api/shopping/products          — 상품 목록 (필터: category, is_new, is_recommended)
GET    /api/shopping/products/{id}     — 상품 상세
POST   /api/shopping/products          — 상품 등록 (auth)
PUT    /api/shopping/products/{id}     — 상품 수정 (auth)
DELETE /api/shopping/products/{id}     — 상품 삭제 (auth)

# 카테고리 API
GET    /api/shopping/categories        — 카테고리 목록
POST   /api/shopping/categories        — 카테고리 등록 (auth)
PUT    /api/shopping/categories/{id}   — 카테고리 수정 (auth)
DELETE /api/shopping/categories/{id}   — 카테고리 삭제 (auth)

# 뉴스 API
GET    /api/shopping/news              — 뉴스 목록
POST   /api/shopping/news              — 뉴스 등록 (auth)
PUT    /api/shopping/news/{id}         — 뉴스 수정 (auth)
DELETE /api/shopping/news/{id}         — 뉴스 삭제 (auth)

# 매장 API
GET    /api/shopping/stores            — 매장 목록
POST   /api/shopping/stores            — 매장 등록 (auth)
PUT    /api/shopping/stores/{id}       — 매장 수정 (auth)
DELETE /api/shopping/stores/{id}       — 매장 삭제 (auth)

# 설정 API
GET    /api/shopping/config            — 쇼핑몰 설정 조회
PUT    /api/shopping/config            — 쇼핑몰 설정 수정 (auth)
```

### Step 4: 어드민 페이지 — 쇼핑몰 관리

**파일 위치: `src/app/admin/shopping/`**

#### 4-1. 상품 관리 (`/admin/shopping/products/page.tsx`)
- 상품 목록 테이블 (썸네일, 이름, 카테고리, 가격, 할인가, 상태)
- 상품 추가/수정 모달:
  - 상품명 (한글/영문)
  - 카테고리 선택 (드롭다운)
  - 가격, 할인가
  - 설명 (textarea)
  - 이미지 업로드 (다중, 드래그앤드롭)
  - 대표 이미지 선택
  - 신상품/추천 토글
  - 정렬 순서
- 삭제 확인 모달
- 카테고리별 필터

#### 4-2. 카테고리 관리 (`/admin/shopping/categories/page.tsx`)
- 카테고리 목록 테이블 (이름, 상품 수, 상태)
- 카테고리 추가/수정 모달:
  - 카테고리명 (한글/영문)
  - 설명
  - 배너 이미지 업로드
  - 정렬 순서
- 삭제 확인 (상품이 있는 카테고리 삭제 경고)

#### 4-3. 뉴스/캠페인 관리 (`/admin/shopping/news/page.tsx`)
- 뉴스 목록 테이블 (제목, 카테고리, 날짜, 상태)
- 뉴스 추가/수정 모달:
  - 제목
  - 카테고리 (소식/캠페인)
  - 내용 (textarea)
  - 대표 이미지 업로드
- 삭제 확인 모달

#### 4-4. 매장 관리 (`/admin/shopping/stores/page.tsx`)
- 매장 목록 테이블 (매장명, 지역, 주소, 전화)
- 매장 추가/수정 모달:
  - 매장명
  - 지역 (국내/해외)
  - 주소
  - 전화번호
  - 정렬 순서

#### 4-5. 쇼핑몰 설정 (`/admin/shopping/config/page.tsx`)
- 기본 정보: 쇼핑몰명, 로고 업로드
- 히어로: 이미지 업로드, 제목, 부제
- 시즌 배너: 이미지, 제목, 부제
- 프로모션 텍스트
- 소개 페이지 내용 + 이미지
- 푸터 정보 (사업자 정보)
- SNS 링크

### Step 5: 프론트엔드 — 백엔드 연동

기존 샘플 데이터를 백엔드 API 호출로 교체:

| 페이지 | 연동 내용 |
|--------|----------|
| `/templates/shopping` | ShopConfig + 신상품 + 추천상품 + 카테고리 + 뉴스 |
| `/templates/shopping/shop` | Products 목록 (필터/페이지네이션) |
| `/templates/shopping/product/[id]` | Product 상세 |
| `/templates/shopping/about` | ShopConfig.about_content |
| `/templates/shopping/news` | ShopNews 목록 |
| `/templates/shopping/stores` | Store 목록 |

### Step 6: 어드민 사이드바 업데이트

**파일: `src/components/admin/AdminSidebar.tsx`**

쇼핑몰 관리 메뉴 추가:
- 쇼핑몰 설정
- 상품 관리
- 카테고리 관리
- 뉴스/캠페인
- 매장 관리

---

## 수정하는 파일 목록 (충돌 방지)

### 새로 생성하는 파일 (Team A 전용)
```
backend/app/models/shopping.py
backend/app/schemas/shopping.py
backend/app/routers/shopping.py
src/app/admin/shopping/products/page.tsx
src/app/admin/shopping/categories/page.tsx
src/app/admin/shopping/news/page.tsx
src/app/admin/shopping/stores/page.tsx
src/app/admin/shopping/config/page.tsx
src/app/admin/shopping/layout.tsx
```

### 수정하는 공유 파일 (주의!)
```
backend/app/main.py          — shopping 라우터 등록 추가
src/components/admin/AdminSidebar.tsx — 쇼핑몰 메뉴 추가
src/app/admin/page.tsx        — 대시보드에 쇼핑몰 카드 활성화
```

> **충돌 주의**: `backend/app/main.py`, `AdminSidebar.tsx`, `admin/page.tsx`는 다른 팀도 수정합니다.
> 머지 시 충돌 해결 필요. 각 팀은 자기 섹션만 추가하는 방식으로 작업하세요.

---

## 완료 기준

- [ ] 백엔드: 모든 Shopping API가 정상 동작 (Swagger UI에서 테스트)
- [ ] 어드민: 상품 CRUD가 이미지 업로드와 함께 동작
- [ ] 어드민: 카테고리, 뉴스, 매장, 설정 CRUD 동작
- [ ] 프론트: 쇼핑몰 메인 페이지가 백엔드 데이터로 렌더링
- [ ] 프론트: 상품 목록/상세 페이지가 실제 데이터로 동작
- [ ] 반응형: 모바일/태블릿에서 어드민 페이지 정상 표시
