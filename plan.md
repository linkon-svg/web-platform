# Web Platform - 웹사이트 템플릿 시스템

## 프로젝트 개요
고객에게 빠르게 웹사이트를 만들어주기 위한 4종 템플릿 시스템

## 템플릿 종류
1. 랜딩페이지 (원페이지 소개)
2. 쇼핑몰 / 이커머스
3. 기업 홈페이지 (회사소개, 서비스, 문의)
4. 포트폴리오 / 개인 사이트

## 기술 스택
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + SQLite
- Auth: JWT
- i18n: ko/en/ja/zh

## Phase 1: 공통 인프라 (참고 사이트 도착 전 선행 작업)

### 터미널 A — 프로젝트 세팅
- 담당: 프로젝트 초기화, 설정 파일
- 수정 파일:
  - package.json
  - tsconfig.json
  - next.config.ts
  - tailwind.config.ts
  - postcss.config.mjs
  - eslint.config.mjs
  - .gitignore
  - .env.example
- 할 일:
  1. Next.js 프로젝트 생성 (npx create-next-app@latest)
  2. Tailwind CSS 설정
  3. TypeScript 설정
  4. 폴더 구조 생성:
     - src/app/ (라우팅)
     - src/components/common/ (공통 컴포넌트)
     - src/components/templates/ (템플릿별 컴포넌트)
     - src/lib/ (유틸리티)
     - src/i18n/ (다국어)
     - src/styles/ (글로벌 스타일)
     - src/types/ (타입 정의)
  5. 다국어 시스템 기본 구조 (ko/en/ja/zh JSON 파일)
  6. 공통 타입 정의 (Template, Page, Component 타입)
- ⚠️ 건드리지 말 것: backend/ 폴더

### 터미널 B — 백엔드 API
- 담당: FastAPI 백엔드 전체
- 수정 파일:
  - backend/ 폴더 전체
- 할 일:
  1. FastAPI 프로젝트 구조 생성
     - backend/app/main.py
     - backend/app/models/
     - backend/app/routers/
     - backend/app/schemas/
     - backend/app/core/ (config, security)
     - backend/app/database.py
  2. DB 모델 설계:
     - User (어드민 사용자)
     - Site (생성된 사이트)
     - Template (템플릿 종류)
     - Page (사이트 내 페이지)
     - SiteConfig (사이트별 설정: 로고, 색상, 폰트 등)
  3. JWT 인증 시스템
  4. CRUD API:
     - POST /api/sites (사이트 생성)
     - GET /api/sites (사이트 목록)
     - GET /api/sites/{id} (사이트 상세)
     - PUT /api/sites/{id} (사이트 수정)
     - DELETE /api/sites/{id} (사이트 삭제)
     - POST /api/auth/login
     - GET /api/templates (템플릿 목록)
  5. requirements.txt 생성
  6. venv 설정
- ⚠️ 건드리지 말 것: src/ 폴더, package.json 등 프론트 파일

### 터미널 C — 프론트 공통 컴포넌트
- 담당: 공통 UI 컴포넌트, 어드민 레이아웃
- 수정 파일:
  - src/components/common/ 폴더
  - src/components/admin/ 폴더
  - src/app/admin/ 폴더
  - src/styles/ 폴더
- 할 일:
  1. 공통 컴포넌트:
     - Header (반응형 네비게이션)
     - Footer
     - Button (variants: primary, secondary, outline)
     - Card
     - Input / Textarea / Select
     - Modal
     - Loading / Skeleton
  2. 어드민 대시보드 레이아웃:
     - 사이드바 네비게이션
     - 대시보드 홈 (사이트 목록)
     - 사이트 생성 페이지 (템플릿 선택)
     - 사이트 편집 페이지
  3. 글로벌 스타일 (CSS 변수, 폰트 설정)
  4. 반응형 브레이크포인트 설정
- ⚠️ 건드리지 말 것: backend/ 폴더, src/i18n/ 폴더
- ⚠️ 터미널 A가 프로젝트 초기화를 완료한 후 시작할 것

## Phase 2: 템플릿 디자인 & 개발 (참고 사이트 도착 후)
- 사장님이 보내주는 참고 사이트를 기반으로 각 템플릿 개발
- 템플릿별로 터미널 배정 예정

## Phase 3: 연동 & QA
- 프론트 ↔ 백엔드 API 연동
- 어드민에서 사이트 생성/관리 테스트
- 다국어 전환 테스트
- 반응형 테스트 (모바일/태블릿/PC)
