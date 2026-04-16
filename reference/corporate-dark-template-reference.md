# 기업 홈페이지 템플릿 (다크 버전) 레퍼런스 — 크래프톤 (krafton.com)

## 사이트 구조 (Sitemap)

### 메인 네비게이션
1. **About** — 비전 (/about/vision/)
2. **Studios** — 스튜디오 목록 (/studios/)
3. **Games** — 게임 목록 (/games/)
4. **More Experience** (/more-experience/)
5. **Careers** — 채용 (/careers/people/, /careers/jobs/)
6. **IR** — 투자정보
7. **CSR** — 사회공헌
8. **News** — 뉴스/보도자료 (/news/press/)
9. **다국어**: KO / EN / CN / JP (4개국어)

## 메인 페이지 구성

### 섹션 1: 풀스크린 비디오/이미지 히어로
- 다크 배경에 대형 비주얼
- 스크롤 유도 화살표

### 섹션 2: News 섹션
- "News" 헤딩
- 뉴스 카드 3개 (제목 + 날짜 + 링크)
- 각 카드 클릭 시 상세 페이지

### 섹션 3: Careers 섹션
- 2개 카드:
  1. PEOPLE & LIFE — "자유로운 소통과 활발한 교류를 바탕으로 크래프톤 만의 문화를 만들어 갑니다."
  2. KRAFTON RECRUIT — "크래프톤의 최신 채용공고를 살펴보세요."
- 배경 이미지 + 오버레이 텍스트

### 섹션 4: KRAFTON GAMES 캐러셀
- "KRAFTON GAMES" 헤딩
- 가로 스크롤 슬라이더 (20개+ 게임)
- 각 카드: 스튜디오명 + 게임 타이틀 + 썸네일
- Previous/Next 버튼

### 섹션 5: Studios 섹션
- "Studios" 헤딩 + "More" 링크
- 스튜디오 카드 (4개):
  1. PUBG STUDIOS
  2. Bluehole Studio
  3. RisingWings
  4. Striking Distance Studios
- 각 카드: 스튜디오명 + 한 줄 소개 + 배경 이미지

### 섹션 6: 푸터
- 링크: 찾아오시는 길, 개인정보처리방침, 문의하기, 열린신고제도
- SNS: Blog, Youtube, Instagram, Facebook, LinkedIn
- FAMILY SITE 드롭다운
- 회사 정보: 대표이사, 주소, 전화, 팩스, 이메일, 사업자등록번호, 통신판매업

## 서브페이지 구성

### About > Vision (/about/vision/)
- 풀스크린 다크 히어로
- 비전/미션 텍스트
- 대형 타이포그래피

### Careers > People (/careers/people/)
- 사내 문화 소개
- 이미지 + 텍스트 교차 레이아웃

### News > Press (/news/press/)
- 뉴스 카드 그리드
- 필터 (카테고리)
- 페이지네이션

## 디자인 특징

### 컬러 (다크 버전)
- Background: #000000 또는 #111111 (딥 블랙)
- Text Primary: #FFFFFF (화이트)
- Text Secondary: #999999 또는 #AAAAAA
- Accent: 없음 (모노크롬) 또는 브랜드 그린
- Card BG: #1A1A1A ~ #222222
- Hover: 밝아지는 효과 (opacity 변화)
- 구분선: #333333

### 타이포그래피
- 영문: 산세리프, 대문자 사용 빈번 (KRAFTON, PUBG STUDIOS 등)
- 한글: 산세리프
- 헤딩: 매우 큰 볼드 (40~60px+)
- 본문: 라이트 (14~16px), 밝은 그레이
- 자간/행간: 넓은 편 (고급스러운 느낌)

### 레이아웃
- 풀스크린 섹션 (100vh)
- 넓은 여백 (100px+ 섹션 간격)
- 이미지/비디오 중심
- 카드형: 어두운 배경 + 밝은 텍스트
- 가로 스크롤 캐러셀 (게임 목록)
- 2열 카드 그리드 (Careers, Studios)

### 반응형
- 데스크탑: 풀스크린 비주얼, 다열 그리드
- 모바일: 세로 스택, 햄버거 메뉴

### UX 특징
- 다국어 4개 (KO/EN/CN/JP) — 헤더에 바로 노출
- 쿠키 동의 배너
- 풀스크린 비디오 히어로
- 스크롤 기반 애니메이션 (페이드인)
- 호버 시 카드 밝아지는 효과
- SNS 링크 5개 (Blog, Youtube, Instagram, Facebook, LinkedIn)

## 카카오 (밝은 버전)과의 차이점

| 요소 | 카카오 (밝은) | 크래프톤 (다크) |
|---|---|---|
| 배경 | 화이트 #FFF | 블랙 #000 |
| 텍스트 | 다크 #191919 | 화이트 #FFF |
| 분위기 | 친근, 신뢰, 깔끔 | 강렬, 프리미엄, 몰입감 |
| 히어로 | 뉴스 슬라이더 | 풀스크린 비디오 |
| 메뉴 | 메가 드롭다운 | 심플 가로 링크 |
| 푸터 | 메가 푸터 (대량 링크) | 간결한 푸터 |
| 다국어 | 2개 (한/영) | 4개 (한/영/중/일) |
| 다크모드 | 토글 지원 | 기본 다크 |
| 적합 업종 | IT, 플랫폼, 금융, 일반 기업 | 게임, 엔터, 패션, 럭셔리 |

## 템플릿 변환 시 핵심 섹션 (재사용 가능)
1. 헤더 (로고 + 심플 메뉴 + 다국어 선택)
2. 풀스크린 비디오/이미지 히어로
3. 뉴스 카드 섹션 (제목 + 날짜 + 링크) x 3
4. 2열 카드 (이미지 배경 + 오버레이 텍스트)
5. 가로 스크롤 캐러셀 (제품/프로젝트)
6. 팀/스튜디오 카드 그리드
7. 다크 푸터 (SNS + 회사정보)
8. 쿠키 동의 배너
9. 스크롤 애니메이션 (페이드인)

## 스크린샷 파일
- `krafton-home.png` — 메인 뷰포트
- `krafton-home-full.png` — 메인 전체
- `krafton-about.png` — About/Vision
- `krafton-careers.png` — Careers
- `krafton-news.png` — News
