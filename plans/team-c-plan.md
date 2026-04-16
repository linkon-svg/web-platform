# Team C — Landing 템플릿 + 공통 시스템 개선

> 레퍼런스: 리멤버 (remember.co.kr)
> 워크트리: 별도 브랜치에서 작업

---

## 담당 범위

1. **Landing 템플릿** — 백엔드 모델/API + 어드민 페이지 + 프론트엔드 백엔드 연동
2. **어드민 대시보드 개선** — 템플릿 전환 시스템
3. **공통 개선** — Hospital 템플릿 프론트-백엔드 연동 마무리

---

## 현재 상태 (이미 완료된 것)

### Landing 프론트엔드 (`/templates/landing`)
- 메인 1페이지 구현 (샘플 데이터)
- 컴포넌트 6개: HeroSection, FeatureSection, CardCarousel, ServiceGrid, PromoBar, LandingFooter

### Hospital (참고)
- 어드민 7개 페이지 완료
- 백엔드 API 완료
- 프론트엔드 페이지 존재하지만 **샘플 데이터 사용 중** (백엔드 미연동)

---

## 작업 목록

---

## Part 1: Landing 템플릿

### Step 1: 백엔드 — DB 모델 생성

**파일: `backend/app/models/landing.py`**

```
LandingConfig (랜딩 사이트 설정)
├── id: int (PK)
├── site_id: int (FK, unique)
├── site_name: str
├── logo: str
├── promo_bar_text: str ("리멤버에서 450만 경력직 인재를 찾아보세요")
├── promo_bar_link: str
├── promo_bar_active: bool
├── hero_title: str
├── hero_subtitle: str
├── hero_cta_text: str
├── hero_cta_link: str
├── hero_background: str (이미지/일러스트)
├── footer_company_name: str
├── footer_ceo: str
├── footer_address: str
├── footer_phone: str
├── footer_email: str
├── footer_business_number: str
├── footer_links: JSON ([{name, url}])
├── sns_links: JSON ({blog, linkedin, facebook, brunch})
└── app_download_links: JSON ({ios, android})

LandingSection (서비스 소개 섹션 — 반복 블록)
├── id: int (PK)
├── site_id: int (FK)
├── title: str (서비스명: "Career", "Business", "Community")
├── title_image: str (SVG 타이틀 이미지, optional)
├── heading: str ("프로필 등록하면 스카웃 제안이 찾아와요!")
├── description: str ("내 경력과 전문성에 딱 맞는 제안을 만나보세요.")
├── cta_text: str ("지금 프로필 등록하기")
├── cta_link: str
├── background_image: str (일러스트)
├── background_color: str (optional, hex)
├── layout: str ("left-text" | "right-text" | "center")
├── has_carousel: bool (카드 캐러셀 포함 여부)
├── sort_order: int
└── is_active: bool

LandingCard (캐러셀용 카드)
├── id: int (PK)
├── section_id: int (FK → LandingSection)
├── title: str
├── description: str
├── image: str
├── link: str
├── sort_order: int
└── is_active: bool

LandingServiceCard (기업용 서비스 그리드)
├── id: int (PK)
├── site_id: int (FK)
├── title: str ("채용 솔루션")
├── description: str ("다른 곳에는 없는 핵심 인재들을 만나보세요")
├── icon: str
├── link: str
├── sort_order: int
└── is_active: bool
```

### Step 2: 백엔드 — Pydantic 스키마

**파일: `backend/app/schemas/landing.py`**

각 모델에 대해 Create / Update / Response / List 스키마

### Step 3: 백엔드 — API 라우터

**파일: `backend/app/routers/landing.py`**

```
# 설정 API
GET    /api/landing/config             — 랜딩 설정 조회
PUT    /api/landing/config             — 랜딩 설정 수정 (auth)

# 섹션 API
GET    /api/landing/sections           — 섹션 목록 (정렬순)
POST   /api/landing/sections           — 섹션 등록 (auth)
PUT    /api/landing/sections/{id}      — 섹션 수정 (auth)
DELETE /api/landing/sections/{id}      — 섹션 삭제 (auth)
PUT    /api/landing/sections/reorder   — 섹션 순서 변경 (auth)

# 카드 API (섹션 내 캐러셀 카드)
GET    /api/landing/sections/{id}/cards — 섹션의 카드 목록
POST   /api/landing/sections/{id}/cards — 카드 등록 (auth)
PUT    /api/landing/cards/{id}          — 카드 수정 (auth)
DELETE /api/landing/cards/{id}          — 카드 삭제 (auth)

# 서비스 카드 API (하단 그리드)
GET    /api/landing/services           — 서비스 카드 목록
POST   /api/landing/services           — 서비스 카드 등록 (auth)
PUT    /api/landing/services/{id}      — 서비스 카드 수정 (auth)
DELETE /api/landing/services/{id}      — 서비스 카드 삭제 (auth)
```

### Step 4: 어드민 페이지 — 랜딩 관리

**파일 위치: `src/app/admin/landing/`**

#### 4-1. 랜딩 설정 (`/admin/landing/config/page.tsx`)
- 기본 정보: 사이트명, 로고 업로드
- 프로모 배너: 텍스트, 링크, 활성화 토글
- 히어로: 제목, 부제, CTA 텍스트/링크, 배경 이미지
- 푸터 정보: 회사명, 대표, 주소, 전화, 이메일, 사업자번호
- 푸터 링크: 동적 추가/삭제 ([{name, url}])
- SNS 링크
- 앱 다운로드 링크 (iOS/Android)

#### 4-2. 섹션 관리 (`/admin/landing/sections/page.tsx`)
- 섹션 목록 (드래그앤드롭 순서 변경)
- 각 섹션 카드에 표시: 제목, 레이아웃, 캐러셀 유무, 활성화 상태
- 섹션 추가/수정 모달:
  - 서비스 제목
  - 타이틀 이미지 업로드 (SVG)
  - 핵심 메시지 (heading)
  - 부가 설명 (description)
  - CTA 텍스트 / 링크
  - 배경 이미지 업로드
  - 배경 색상 (선택)
  - 레이아웃 선택 (좌측 텍스트 / 우측 텍스트 / 중앙)
  - 캐러셀 포함 여부 토글
- 섹션 삭제 확인 (하위 카드도 삭제 경고)

#### 4-3. 캐러셀 카드 관리 (`/admin/landing/cards/page.tsx`)
- 섹션별 카드 목록 (섹션 드롭다운으로 필터)
- 카드 추가/수정 모달:
  - 소속 섹션 선택
  - 제목
  - 설명
  - 이미지 업로드
  - 링크
  - 정렬 순서

#### 4-4. 서비스 카드 관리 (`/admin/landing/services/page.tsx`)
- 서비스 카드 목록 (하단 2x2 그리드용)
- 카드 추가/수정 모달:
  - 제목 ("채용 솔루션")
  - 설명 ("다른 곳에는 없는 핵심 인재들을 만나보세요")
  - 아이콘 업로드
  - 링크
  - 정렬 순서

### Step 5: 프론트엔드 — 백엔드 연동

| 컴포넌트 | 연동 내용 |
|---------|----------|
| PromoBar | LandingConfig.promo_bar_* |
| HeroSection | LandingConfig.hero_* |
| FeatureSection | LandingSection 목록 (반복 렌더링) |
| CardCarousel | LandingCard (섹션별) |
| ServiceGrid | LandingServiceCard 목록 |
| LandingFooter | LandingConfig.footer_* + sns_links |

### Step 6: Landing 서브페이지 추가

```
/templates/landing/company    — 회사 소개 (LandingConfig 기반)
```

> 랜딩은 기본적으로 원페이지이므로 서브페이지가 적음

---

## Part 2: 어드민 대시보드 개선

### Step 7: 템플릿 전환 시스템 (`/admin/page.tsx`)

현재 대시보드에서 Hospital만 활성화되어 있고 나머지는 비활성.
개선 사항:

- 템플릿 카드 클릭 시 해당 템플릿 어드민으로 이동
- 각 템플릿별 상태 표시 (등록된 데이터 수)
- Hospital: 의사 N명, 진료 N개...
- Shopping: 상품 N개, 카테고리 N개...
- Corporate: 뉴스 N개, 서비스 N개...
- Landing: 섹션 N개, 카드 N개...

**파일: `src/app/admin/page.tsx`** 수정

### Step 8: 어드민 사이드바 — 템플릿별 메뉴 구조

**파일: `src/components/admin/AdminSidebar.tsx`** 수정

```
어드민 사이드바 구조:
├── 대시보드
├── ─── 템플릿 구분선 ───
├── 🏥 병원 (Hospital)
│   ├── 병원 정보
│   ├── 의사 관리
│   ├── 진료 관리
│   ├── 프로모션
│   ├── 공간 관리
│   ├── 스케줄
│   └── 히어로 이미지
├── 🛒 쇼핑몰 (Shopping)     ← Team A가 추가
│   ├── 쇼핑몰 설정
│   ├── 상품 관리
│   ├── ...
├── 🏢 기업 (Corporate)      ← Team B가 추가
│   ├── 기업 설정
│   ├── ...
├── 📄 랜딩 (Landing)         ← Team C가 추가
│   ├── 랜딩 설정
│   ├── 섹션 관리
│   ├── 캐러셀 카드
│   └── 서비스 카드
└── ─── 시스템 ───
    └── 로그아웃
```

---

## Part 3: Hospital 프론트-백엔드 연동 마무리

### Step 9: Hospital 공개 페이지 백엔드 연동

현재 Hospital 프론트엔드 페이지들은 하드코딩된 샘플 데이터를 사용 중.
이를 백엔드 API로 교체:

| 페이지 | 현재 | 연동 대상 |
|--------|------|----------|
| `/` (홈) | 샘플 데이터 | Hospital 정보 + 진료 + 공간 |
| `/introduce` | 샘플 데이터 | Hospital.philosophy |
| `/introduce/space` | 샘플 데이터 | SpaceImage 목록 |
| `/introduce/staff` | 샘플 데이터 | Doctor 목록 |
| `/introduce/schedule` | 샘플 데이터 | Schedule |
| `/exhibitions` | 샘플 데이터 | Promotion 목록 |

**수정 파일:**
```
src/app/page.tsx
src/app/introduce/page.tsx
src/app/introduce/space/page.tsx
src/app/introduce/staff/page.tsx
src/app/introduce/schedule/page.tsx
src/app/exhibitions/page.tsx
```

---

## 수정하는 파일 목록 (충돌 방지)

### 새로 생성하는 파일 (Team C 전용)
```
backend/app/models/landing.py
backend/app/schemas/landing.py
backend/app/routers/landing.py

src/app/admin/landing/config/page.tsx
src/app/admin/landing/sections/page.tsx
src/app/admin/landing/cards/page.tsx
src/app/admin/landing/services/page.tsx
src/app/admin/landing/layout.tsx

src/app/templates/landing/company/page.tsx
```

### 수정하는 파일 (Team C 담당)
```
# Hospital 프론트 연동
src/app/page.tsx
src/app/introduce/page.tsx
src/app/introduce/space/page.tsx
src/app/introduce/staff/page.tsx
src/app/introduce/schedule/page.tsx
src/app/exhibitions/page.tsx

# Landing 프론트 연동
src/app/templates/landing/page.tsx
src/components/templates/landing/HeroSection.tsx
src/components/templates/landing/FeatureSection.tsx
src/components/templates/landing/CardCarousel.tsx
src/components/templates/landing/ServiceGrid.tsx
src/components/templates/landing/PromoBar.tsx
src/components/templates/landing/LandingFooter.tsx
```

### 수정하는 공유 파일 (주의!)
```
backend/app/main.py          — landing 라우터 등록 추가
src/components/admin/AdminSidebar.tsx — 랜딩 메뉴 추가
src/app/admin/page.tsx        — 대시보드 템플릿 전환 시스템 개선
```

> **충돌 주의**: `backend/app/main.py`, `AdminSidebar.tsx`, `admin/page.tsx`는 다른 팀도 수정합니다.

---

## 완료 기준

- [ ] 백엔드: 모든 Landing API가 정상 동작
- [ ] 어드민: 랜딩 설정, 섹션, 카드, 서비스 카드 CRUD 동작
- [ ] 어드민: 섹션 드래그앤드롭 순서 변경 동작
- [ ] 프론트 Landing: 메인 페이지가 백엔드 데이터로 렌더링
- [ ] 프론트 Hospital: 모든 공개 페이지가 백엔드 데이터로 렌더링 (샘플 데이터 제거)
- [ ] 대시보드: 4개 템플릿 모두 클릭 가능, 데이터 통계 표시
- [ ] 사이드바: 템플릿별 메뉴 구조 완성
- [ ] 반응형: 모바일/태블릿에서 정상 표시
