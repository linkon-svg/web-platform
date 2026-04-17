from datetime import date, datetime, timezone
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.core.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    from app.models.user import User
    from app.models.hospital import Hospital, Doctor, Schedule, Treatment, Promotion, Philosophy, SpaceImage
    from app.models.shopping import ShopConfig, Category, Product, ShopNews, Store
    from app.models.corporate import CorporateConfig, CorporateService, CorporateNews, CorporateTeam, CorporateCareer, CorporateMilestone
    from app.models.landing import LandingConfig, LandingSection, LandingCard, LandingServiceCard
    from app.models.site import Template, Site, Page, SiteConfig
    from app.core.security import get_password_hash

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed data if empty
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(Hospital))
        if result.scalars().first() is None:
            # Admin user
            admin = User(
                email="admin@linkonkr.com",
                hashed_password=get_password_hash("dnflwlq12!"),
                is_active=True,
            )
            session.add(admin)

            # Hospital
            hospital = Hospital(
                name="예피다의원",
                name_en="Yepida Clinic",
                phone="02-6952-2586",
                address="서울특별시 강남구 테헤란로 123 예피다빌딩 3층",
                business_number="123-45-67890",
                ceo="김예피",
                logo_url="/images/logo.png",
            )
            session.add(hospital)
            await session.flush()

            # Doctors
            doctors = [
                Doctor(
                    hospital_id=hospital.id,
                    name="김예피",
                    title="대표원장",
                    photo_url="/images/doctors/doctor1.jpg",
                    education=["서울대학교 의과대학 졸업", "서울대학교 의과대학 석사", "피부과 전문의"],
                    career=["前 서울대학교병원 피부과 전공의", "대한피부과학회 정회원", "대한미용피부외과학회 정회원", "미국피부과학회(AAD) 회원"],
                    sort_order=1,
                ),
                Doctor(
                    hospital_id=hospital.id,
                    name="이수진",
                    title="부원장",
                    photo_url="/images/doctors/doctor2.jpg",
                    education=["연세대학교 의과대학 졸업", "피부과 전문의"],
                    career=["前 세브란스병원 피부과 전공의", "대한피부과학회 정회원", "레이저학회 정회원"],
                    sort_order=2,
                ),
                Doctor(
                    hospital_id=hospital.id,
                    name="박민호",
                    title="원장",
                    photo_url="/images/doctors/doctor3.jpg",
                    education=["고려대학교 의과대학 졸업", "피부과 전문의"],
                    career=["前 고려대학교병원 피부과 전공의", "대한피부과학회 정회원", "보톡스/필러 인증의"],
                    sort_order=3,
                ),
            ]
            session.add_all(doctors)

        await session.commit()

    # Shopping seed data
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(ShopConfig))
        if result.scalars().first() is not None:
            return  # Already seeded

        # Shop config
        shop_config = ShopConfig(
            shop_name="SOLID HOMME",
            shop_name_en="SOLID HOMME",
            logo="/images/shop/logo.png",
            hero_image="/images/shop/hero.jpg",
            hero_title="2026 Spring-Summer",
            hero_subtitle="새로운 시즌, 새로운 스타일",
            season_banner_image="/images/shop/season-banner.jpg",
            season_banner_title="2026 봄-여름",
            season_banner_subtitle="선물 제안",
            promo_text="전 상품 무료 배송 & 무료 반품",
            about_content="솔리드옴므는 현대 남성의 라이프스타일을 위한 프리미엄 패션 브랜드입니다.",
            footer_info={
                "company": "주식회사 솔리드",
                "ceo": "김대표",
                "business_number": "123-45-67890",
                "address": "서울특별시 강남구 압구정로 123",
                "phone": "02-1234-5678",
                "email": "info@solidhomme.com",
            },
            sns_links={
                "instagram": "https://instagram.com/solidhomme",
                "youtube": "https://youtube.com/solidhomme",
            },
        )
        session.add(shop_config)

        # Categories
        categories = [
            Category(name="아우터", name_en="Outerwear", description="새롭게 재해석 되는 하나의 작품", image="/images/shop/cat-outerwear.jpg", sort_order=1),
            Category(name="상의", name_en="Tops", description="모던한 실루엣의 상의 컬렉션", image="/images/shop/cat-tops.jpg", sort_order=2),
            Category(name="하의", name_en="Bottoms", description="완벽한 핏의 하의 라인업", image="/images/shop/cat-bottoms.jpg", sort_order=3),
            Category(name="악세서리", name_en="Accessories", description="기능성을 겸비한 섬세한 컬렉션", image="/images/shop/cat-accessories.jpg", sort_order=4),
        ]
        session.add_all(categories)
        await session.flush()

        # Products
        products = [
            Product(name="오버사이즈 트렌치코트", name_en="Oversized Trench Coat", price=890000, category_id=categories[0].id, thumbnail="/images/shop/product1.jpg", is_new=True, sort_order=1),
            Product(name="울 블렌드 더블 코트", name_en="Wool Blend Double Coat", price=1250000, category_id=categories[0].id, thumbnail="/images/shop/product2.jpg", is_new=True, sort_order=2),
            Product(name="캐시미어 니트", name_en="Cashmere Knit", price=450000, category_id=categories[1].id, thumbnail="/images/shop/product3.jpg", is_recommended=True, sort_order=3),
            Product(name="실크 블렌드 셔츠", name_en="Silk Blend Shirt", price=380000, category_id=categories[1].id, thumbnail="/images/shop/product4.jpg", is_new=True, sort_order=4),
            Product(name="와이드 슬랙스", name_en="Wide Slacks", price=320000, category_id=categories[2].id, thumbnail="/images/shop/product5.jpg", is_recommended=True, sort_order=5),
            Product(name="테이퍼드 트라우저", name_en="Tapered Trousers", price=280000, category_id=categories[2].id, thumbnail="/images/shop/product6.jpg", sort_order=6),
            Product(name="레더 토트백", name_en="Leather Tote Bag", price=680000, category_id=categories[3].id, thumbnail="/images/shop/product7.jpg", is_recommended=True, sort_order=7),
            Product(name="실버 커프링크", name_en="Silver Cufflinks", price=180000, category_id=categories[3].id, thumbnail="/images/shop/product8.jpg", sort_order=8),
        ]
        session.add_all(products)

        # ShopNews
        news_items = [
            ShopNews(title="2026 S/S 컬렉션 런칭", content="솔리드옴므의 새로운 봄-여름 컬렉션을 만나보세요.", image="/images/shop/news1.jpg", category="소식"),
            ShopNews(title="압구정 플래그십 스토어 오픈", content="새롭게 단장한 압구정 플래그십 스토어를 소개합니다.", image="/images/shop/news2.jpg", category="소식"),
            ShopNews(title="홀리데이 기프트 캠페인", content="소중한 사람에게 특별한 선물을 전하세요.", image="/images/shop/news3.jpg", category="캠페인"),
            ShopNews(title="아티스트 콜라보레이션", content="현대 아티스트와의 특별한 협업 컬렉션.", image="/images/shop/news4.jpg", category="캠페인"),
        ]
        session.add_all(news_items)

        # Stores
        stores = [
            Store(name="압구정 플래그십", address="서울특별시 강남구 압구정로 123", phone="02-1234-5678", region="국내", sort_order=1),
            Store(name="청담 부티크", address="서울특별시 강남구 청담동 456", phone="02-2345-6789", region="국내", sort_order=2),
            Store(name="현대백화점 본점", address="서울특별시 강남구 압구정로 165", phone="02-3456-7890", region="국내", sort_order=3),
            Store(name="Tokyo Flagship", address="Tokyo, Minato-ku, Omotesando 1-2-3", phone="+81-3-1234-5678", region="해외", sort_order=4),
        ]
        session.add_all(stores)

        await session.commit()

    # Corporate seed data
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(CorporateConfig))
        if result.scalars().first() is not None:
            return

        corp_config = CorporateConfig(
            company_name="크래프톤",
            company_name_en="KRAFTON",
            logo="/images/corporate/logo.png",
            logo_dark="/images/corporate/logo-dark.png",
            hero_type="video",
            hero_media="/images/corporate/hero-video.mp4",
            vision_title="우리의 비전",
            vision_description="게임을 통해 전 세계 사람들에게 즐거움을 선사하고, 새로운 경험을 창조합니다.",
            mission_title="우리의 미션",
            mission_description="최고의 인재들과 함께 혁신적인 게임을 만들어 글로벌 시장을 선도합니다.",
            about_content="크래프톤은 대한민국의 글로벌 게임 기업입니다.",
            dark_mode_default=True,
            language_options=["ko", "en", "ja", "zh"],
            footer_info={
                "ceo": "장병규",
                "address": "서울특별시 강남구 테헤란로 415 크래프톤타워",
                "phone": "02-1234-5678",
                "fax": "02-1234-5679",
                "email": "contact@krafton.com",
                "business_number": "123-45-67890",
            },
            sns_links={
                "blog": "https://blog.krafton.com",
                "youtube": "https://youtube.com/krafton",
                "instagram": "https://instagram.com/krafton",
                "facebook": "https://facebook.com/krafton",
                "linkedin": "https://linkedin.com/company/krafton",
            },
        )
        session.add(corp_config)

        services = [
            CorporateService(title="서비스", title_en="Service", description="나의 세계를 바꾸는 서비스", icon="globe", link="/services", sort_order=1),
            CorporateService(title="AI 기술", title_en="AI Technology", description="나에게 가장 가까운, 가장 쉬운 AI", icon="cpu", link="/tech/ai", sort_order=2),
            CorporateService(title="채용", title_en="Careers", description="함께 나아갈 미래의 크루들에게", icon="users", link="/careers", sort_order=3),
            CorporateService(title="ESG", title_en="ESG", description="지속가능한 미래를 위한 약속과 책임", icon="leaf", link="/esg", sort_order=4),
        ]
        session.add_all(services)

        news_list = [
            CorporateNews(title="2026년 1분기 실적 발표", summary="매출 3조원 달성, 전년 대비 15% 성장", category="보도자료", is_featured=True, image="/images/corporate/news1.jpg"),
            CorporateNews(title="신작 게임 글로벌 론칭", summary="전 세계 200개국 동시 출시", category="뉴스", is_featured=True, image="/images/corporate/news2.jpg"),
            CorporateNews(title="ESG 경영보고서 발간", summary="2025년 지속가능경영 성과 공개", category="공지", is_featured=False, image="/images/corporate/news3.jpg"),
        ]
        session.add_all(news_list)

        teams = [
            CorporateTeam(name="PUBG STUDIOS", name_en="PUBG STUDIOS", description="배틀그라운드를 만든 스튜디오", image="/images/corporate/team-pubg.jpg", sort_order=1),
            CorporateTeam(name="Bluehole Studio", name_en="Bluehole Studio", description="MMORPG 개발의 선구자", image="/images/corporate/team-bluehole.jpg", sort_order=2),
            CorporateTeam(name="RisingWings", name_en="RisingWings", description="모바일 게임 전문 스튜디오", image="/images/corporate/team-risingwings.jpg", sort_order=3),
            CorporateTeam(name="Striking Distance", name_en="Striking Distance Studios", description="차세대 공포 게임 개발", image="/images/corporate/team-striking.jpg", sort_order=4),
        ]
        session.add_all(teams)

        careers = [
            CorporateCareer(title="PEOPLE & LIFE", description="자유로운 소통과 활발한 교류를 바탕으로 크래프톤만의 문화를 만들어 갑니다.", image="/images/corporate/career-people.jpg", link="/careers/people"),
            CorporateCareer(title="KRAFTON RECRUIT", description="크래프톤의 최신 채용공고를 살펴보세요.", image="/images/corporate/career-recruit.jpg", link="/careers/jobs"),
        ]
        session.add_all(careers)

        milestones = [
            CorporateMilestone(year=2026, title="글로벌 MAU 1억 돌파", sort_order=1),
            CorporateMilestone(year=2025, title="크래프톤타워 신사옥 오픈", sort_order=1),
            CorporateMilestone(year=2024, title="인디게임 펀드 500억 조성", sort_order=1),
            CorporateMilestone(year=2023, title="배틀그라운드 글로벌 10억 다운로드", sort_order=1),
            CorporateMilestone(year=2021, title="코스피 상장", sort_order=1),
            CorporateMilestone(year=2018, title="크래프톤 설립", sort_order=1),
        ]
        session.add_all(milestones)

        await session.commit()

    # Landing seed data
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(LandingConfig))
        if result.scalars().first() is not None:
            return

        landing_config = LandingConfig(
            site_name="리멤버",
            logo="/images/landing/logo.png",
            promo_bar_text="리멤버에서 450만 경력직 인재를 찾아보세요",
            promo_bar_link="https://remember.co.kr",
            promo_bar_active=True,
            hero_title="프로를 위한 모든 기회",
            hero_subtitle="리멤버가 연결합니다",
            hero_cta_text="지금 시작하기",
            hero_cta_link="/signup",
            footer_company_name="주식회사 리멤버앤컴퍼니",
            footer_ceo="최재호",
            footer_address="서울특별시 강남구 테헤란로 427",
            footer_phone="02-6205-0300",
            footer_email="help@rememberapp.co.kr",
            footer_business_number="211-88-12345",
            sns_links={"blog": "https://blog.remember.co.kr", "linkedin": "https://linkedin.com/company/remember", "facebook": "https://facebook.com/remember"},
        )
        session.add(landing_config)

        sections = [
            LandingSection(title="Career", heading="프로필 등록하면 스카웃 제안이 찾아와요!", description="내 경력과 전문성에 딱 맞는 제안을 만나보세요.", cta_text="지금 프로필 등록하기", cta_link="/profile", layout="left-text", sort_order=1),
            LandingSection(title="Business", heading="촬영 한 번으로 명함관리 쉽게 해요!", description="내 인맥의 이직, 승진 소식도 받아보세요.", cta_text="명함 관리 시작하기", cta_link="/business", layout="right-text", sort_order=2),
            LandingSection(title="Community", heading="업계 사람들과 깊이 있게 소통해요!", description="커리어 고민과 직장 생활의 노하우를 공유해요.", cta_text="커뮤니티 바로가기", cta_link="/community", layout="left-text", has_carousel=True, sort_order=3),
            LandingSection(title="Now", heading="전문가 브리핑으로 인사이트 충전해요!", description="매일 아침, 국내 최고 전문가들의 경제 브리핑을 받아보세요.", cta_text="바로 읽어보기", cta_link="/now", layout="right-text", has_carousel=True, sort_order=4),
        ]
        session.add_all(sections)
        await session.flush()

        cards = [
            LandingCard(section_id=sections[2].id, title="이직 후기 공유", description="새 직장 적응기를 들어보세요", sort_order=1),
            LandingCard(section_id=sections[2].id, title="업계 트렌드 토론", description="2026년 주목할 키워드는?", sort_order=2),
            LandingCard(section_id=sections[2].id, title="연봉 협상 꿀팁", description="실전 노하우를 공유합니다", sort_order=3),
            LandingCard(section_id=sections[3].id, title="AI 시대의 HR 전략", description="전문가 브리핑", sort_order=1),
            LandingCard(section_id=sections[3].id, title="반도체 시장 전망", description="산업 분석 리포트", sort_order=2),
        ]
        session.add_all(cards)

        service_cards = [
            LandingServiceCard(title="채용 솔루션", description="다른 곳에는 없는 핵심 인재들을 만나보세요", icon="briefcase", link="/recruit", sort_order=1),
            LandingServiceCard(title="광고 상품", description="잠재 고객을 타깃하고 제품을 효과적으로 알리세요", icon="megaphone", link="/ads", sort_order=2),
            LandingServiceCard(title="리서치 서비스", description="설문조사와 전문가 인터뷰로 고객의 정확한 니즈를 파악하세요", icon="chart", link="/research", sort_order=3),
            LandingServiceCard(title="기업용 명함 관리", description="소중한 회사의 영업자산 팀 명함첩으로 관리하세요", icon="card", link="/biz-card", sort_order=4),
        ]
        session.add_all(service_cards)

        await session.commit()

    # Seed default templates if empty (Team C)
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(Template))
        if result.scalars().first() is None:
            default_templates = [
                Template(name="landing", display_name="랜딩페이지", description="원페이지 소개 사이트"),
                Template(name="shopping", display_name="쇼핑몰", description="이커머스 / 쇼핑몰 사이트"),
                Template(name="corporate", display_name="기업 홈페이지", description="회사소개, 서비스, 문의 사이트"),
                Template(name="portfolio", display_name="포트폴리오", description="포트폴리오 / 개인 사이트"),
            ]
            session.add_all(default_templates)
            await session.commit()
