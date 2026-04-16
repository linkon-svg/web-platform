# Team B — Corporate 템플릿 (기업 홈페이지 Dark + Light)

> 레퍼런스: 크래프톤 krafton.com (Dark) / 카카오 kakaocorp.com (Light)
> 워크트리: 별도 브랜치에서 작업

---

## 담당 범위

Corporate Dark + Corporate Light 템플릿의 **백엔드 모델/API + 어드민 페이지 + 프론트엔드 백엔드 연동** 전체

> 두 템플릿은 같은 DB 모델/API를 공유하고, 프론트엔드 렌더링만 다릅니다.

---

## 현재 상태 (이미 완료된 것)

### Corporate Dark 프론트엔드 (`/templates/corporate-dark`)
- 메인 1페이지 구현 (샘플 데이터)
- 컴포넌트 9개: CorporateDarkHeader, CorporateDarkFooter, FullscreenHero, NewsSection, CareersSection, ProductCarousel, TeamGrid, CookieBanner, ScrollFadeIn

### Corporate Light 프론트엔드 (`/templates/corporate-light`)
- 메인 1페이지 구현 (샘플 데이터)
- 컴포넌트 7개: CorporateLightHeader, CorporateLightFooter, HeroNewsSlider, ServiceCardGrid, InfoCardList, ServiceCarousel, TimelineSection

---

## 작업 목록

### Step 1: 백엔드 — DB 모델 생성

**파일: `backend/app/models/corporate.py`**

```
CorporateConfig (기업 사이트 설정)
├── id: int (PK)
├── site_id: int (FK, unique)
├── company_name: str
├── company_name_en: str
├── logo: str
├── logo_dark: str (다크 버전 로고)
├── hero_type: str ("video" | "image" | "slider")
├── hero_media: str (비디오/이미지 URL)
├── hero_slides: JSON (슬라이더인 경우 [{image, title, description, link}])
├── vision_title: str
├── vision_description: text
├── mission_title: str
├── mission_description: text
├── about_content: text
├── footer_info: JSON (회사 정보: 대표, 주소, 전화 등)
├── sns_links: JSON ({blog, youtube, instagram, facebook, linkedin})
├── dark_mode_default: bool (기본 다크모드 여부)
└── language_options: JSON (["ko","en","ja","zh"])

CorporateService (서비스/사업 소개)
├── id: int (PK)
├── site_id: int (FK)
├── title: str
├── title_en: str
├── description: str
├── icon: str (아이콘 이미지 또는 아이콘명)
├── link: str (상세 링크)
├── image: str
├── sort_order: int
└── is_active: bool

CorporateNews (뉴스/보도자료)
├── id: int (PK)
├── site_id: int (FK)
├── title: str
├── content: text
├── summary: str
├── image: str
├── category: str (뉴스/보도자료/공지)
├── is_featured: bool (메인 노출 여부)
├── published_at: datetime
├── is_active: bool
├── created_at: datetime
└── updated_at: datetime

CorporateTeam (팀/스튜디오/계열사)
├── id: int (PK)
├── site_id: int (FK)
├── name: str
├── name_en: str
├── description: str
├── image: str (배경 이미지)
├── link: str
├── sort_order: int
└── is_active: bool

CorporateCareer (채용 정보)
├── id: int (PK)
├── site_id: int (FK)
├── title: str
├── description: str
├── image: str
├── link: str (채용 공고 외부 링크)
├── is_active: bool
├── created_at: datetime
└── updated_at: datetime

CorporateMilestone (연혁)
├── id: int (PK)
├── site_id: int (FK)
├── year: int
├── month: int (optional)
├── title: str
├── description: str
├── image: str (optional)
├── sort_order: int
└── is_active: bool
```

### Step 2: 백엔드 — Pydantic 스키마

**파일: `backend/app/schemas/corporate.py`**

각 모델에 대해 Create / Update / Response / List 스키마

### Step 3: 백엔드 — API 라우터

**파일: `backend/app/routers/corporate.py`**

```
# 설정 API
GET    /api/corporate/config           — 기업 설정 조회
PUT    /api/corporate/config           — 기업 설정 수정 (auth)

# 서비스 API
GET    /api/corporate/services         — 서비스 목록
POST   /api/corporate/services         — 서비스 등록 (auth)
PUT    /api/corporate/services/{id}    — 서비스 수정 (auth)
DELETE /api/corporate/services/{id}    — 서비스 삭제 (auth)

# 뉴스 API
GET    /api/corporate/news             — 뉴스 목록 (필터: category, is_featured)
GET    /api/corporate/news/{id}        — 뉴스 상세
POST   /api/corporate/news             — 뉴스 등록 (auth)
PUT    /api/corporate/news/{id}        — 뉴스 수정 (auth)
DELETE /api/corporate/news/{id}        — 뉴스 삭제 (auth)

# 팀 API
GET    /api/corporate/teams            — 팀 목록
POST   /api/corporate/teams            — 팀 등록 (auth)
PUT    /api/corporate/teams/{id}       — 팀 수정 (auth)
DELETE /api/corporate/teams/{id}       — 팀 삭제 (auth)

# 채용 API
GET    /api/corporate/careers          — 채용 목록
POST   /api/corporate/careers          — 채용 등록 (auth)
PUT    /api/corporate/careers/{id}     — 채용 수정 (auth)
DELETE /api/corporate/careers/{id}     — 채용 삭제 (auth)

# 연혁 API
GET    /api/corporate/milestones       — 연혁 목록 (연도순)
POST   /api/corporate/milestones       — 연혁 등록 (auth)
PUT    /api/corporate/milestones/{id}  — 연혁 수정 (auth)
DELETE /api/corporate/milestones/{id}  — 연혁 삭제 (auth)
```

### Step 4: 어드민 페이지 — 기업 홈페이지 관리

**파일 위치: `src/app/admin/corporate/`**

#### 4-1. 기업 설정 (`/admin/corporate/config/page.tsx`)
- 기본 정보: 회사명 (한글/영문), 로고 업로드 (일반/다크 버전)
- 히어로 설정:
  - 타입 선택 (비디오/이미지/슬라이더)
  - 비디오/이미지 업로드
  - 슬라이더: 슬라이드 추가/수정/삭제 (이미지, 제목, 설명, 링크)
- 비전/미션: 제목 + 본문
- 회사 소개 내용
- 푸터 정보 (대표, 주소, 전화, 팩스, 이메일, 사업자번호)
- SNS 링크 (Blog, Youtube, Instagram, Facebook, LinkedIn)
- 다크모드 기본값 설정
- 지원 언어 설정

#### 4-2. 서비스 관리 (`/admin/corporate/services/page.tsx`)
- 서비스 목록 테이블 (제목, 설명, 상태, 순서)
- 서비스 추가/수정 모달:
  - 제목 (한글/영문)
  - 설명
  - 아이콘 (업로드 또는 아이콘 선택)
  - 이미지 업로드
  - 링크 URL
  - 정렬 순서
- 드래그앤드롭 순서 변경

#### 4-3. 뉴스 관리 (`/admin/corporate/news/page.tsx`)
- 뉴스 목록 테이블 (제목, 카테고리, 날짜, 메인 노출, 상태)
- 뉴스 추가/수정 모달:
  - 제목
  - 카테고리 (뉴스/보도자료/공지)
  - 요약
  - 내용 (textarea)
  - 대표 이미지 업로드
  - 메인 노출 여부 토글
  - 게시일 선택
- 카테고리별 필터
- 메인 노출 뉴스 미리보기

#### 4-4. 팀/스튜디오 관리 (`/admin/corporate/teams/page.tsx`)
- 팀 목록 (이름, 설명, 상태)
- 팀 추가/수정 모달:
  - 이름 (한글/영문)
  - 한 줄 소개
  - 배경 이미지 업로드
  - 상세 링크
  - 정렬 순서

#### 4-5. 채용 관리 (`/admin/corporate/careers/page.tsx`)
- 채용 공고 목록 (제목, 상태, 날짜)
- 채용 추가/수정 모달:
  - 제목
  - 설명
  - 이미지 업로드
  - 외부 링크 (채용 플랫폼 URL)
  - 활성화/비활성화

#### 4-6. 연혁 관리 (`/admin/corporate/milestones/page.tsx`)
- 타임라인 형태 목록 (연도순)
- 연혁 추가/수정 모달:
  - 연도, 월 (선택)
  - 제목
  - 설명
  - 이미지 (선택)
- 연도별 그룹핑 표시

### Step 5: 프론트엔드 — 백엔드 연동

#### Corporate Dark
| 페이지/컴포넌트 | 연동 내용 |
|----------------|----------|
| FullscreenHero | CorporateConfig.hero_media |
| NewsSection | CorporateNews (is_featured=true, limit 3) |
| CareersSection | CorporateCareer (limit 2) |
| ProductCarousel | CorporateTeam 또는 별도 프로젝트 모델 |
| TeamGrid | CorporateTeam 목록 |
| Footer | CorporateConfig.footer_info + sns_links |

#### Corporate Light
| 페이지/컴포넌트 | 연동 내용 |
|----------------|----------|
| HeroNewsSlider | CorporateNews (is_featured=true, limit 3) |
| ServiceCardGrid | CorporateService (limit 4) |
| InfoCardList | CorporateNews 카테고리별 (limit 5) |
| ServiceCarousel | CorporateService 전체 |
| TimelineSection | CorporateMilestone (연도순) |
| Footer | CorporateConfig.footer_info |

### Step 6: Corporate 서브페이지 생성

#### Corporate Dark 서브페이지
```
/templates/corporate-dark/about     — 비전/미션 (CorporateConfig)
/templates/corporate-dark/news      — 뉴스 목록 (CorporateNews)
/templates/corporate-dark/careers   — 채용 목록 (CorporateCareer)
/templates/corporate-dark/teams     — 팀/스튜디오 (CorporateTeam)
```

#### Corporate Light 서브페이지
```
/templates/corporate-light/about      — 회사 소개 + 문화 (CorporateConfig)
/templates/corporate-light/services   — 서비스 목록 (CorporateService)
/templates/corporate-light/news       — 뉴스 목록 (CorporateNews)
/templates/corporate-light/milestones — 연혁 (CorporateMilestone)
```

### Step 7: 어드민 사이드바 업데이트

**파일: `src/components/admin/AdminSidebar.tsx`**

기업 홈페이지 관리 메뉴 추가:
- 기업 설정
- 서비스 관리
- 뉴스 관리
- 팀/스튜디오
- 채용 관리
- 연혁 관리

---

## 수정하는 파일 목록 (충돌 방지)

### 새로 생성하는 파일 (Team B 전용)
```
backend/app/models/corporate.py
backend/app/schemas/corporate.py
backend/app/routers/corporate.py

src/app/admin/corporate/config/page.tsx
src/app/admin/corporate/services/page.tsx
src/app/admin/corporate/news/page.tsx
src/app/admin/corporate/teams/page.tsx
src/app/admin/corporate/careers/page.tsx
src/app/admin/corporate/milestones/page.tsx
src/app/admin/corporate/layout.tsx

src/app/templates/corporate-dark/about/page.tsx
src/app/templates/corporate-dark/news/page.tsx
src/app/templates/corporate-dark/careers/page.tsx
src/app/templates/corporate-dark/teams/page.tsx

src/app/templates/corporate-light/about/page.tsx
src/app/templates/corporate-light/services/page.tsx
src/app/templates/corporate-light/news/page.tsx
src/app/templates/corporate-light/milestones/page.tsx
```

### 수정하는 공유 파일 (주의!)
```
backend/app/main.py          — corporate 라우터 등록 추가
src/components/admin/AdminSidebar.tsx — 기업 메뉴 추가
src/app/admin/page.tsx        — 대시보드에 기업 카드 활성화
```

> **충돌 주의**: 위 3개 파일은 다른 팀도 수정합니다. 머지 시 충돌 해결 필요.

---

## 완료 기준

- [ ] 백엔드: 모든 Corporate API가 정상 동작
- [ ] 어드민: 기업 설정 (히어로 비디오/슬라이더 포함) CRUD 동작
- [ ] 어드민: 서비스, 뉴스, 팀, 채용, 연혁 CRUD 동작
- [ ] 프론트 Dark: 메인 + 서브페이지 4개가 백엔드 데이터로 렌더링
- [ ] 프론트 Light: 메인 + 서브페이지 4개가 백엔드 데이터로 렌더링
- [ ] 다크모드: 기본값 설정이 프론트에 반영됨
- [ ] 반응형: 모바일/태블릿에서 정상 표시
