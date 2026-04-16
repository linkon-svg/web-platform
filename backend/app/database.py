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
    from app.core.security import get_password_hash

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed data if empty
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(Hospital))
        if result.scalars().first() is not None:
            return  # Already seeded

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

        # Schedule
        schedule = Schedule(
            hospital_id=hospital.id,
            weekday="10:00 - 20:30",
            saturday="10:00 - 16:00",
            sunday="10:00 - 16:00",
            holiday="10:00 - 16:00",
            lunch_time="13:00 - 14:00",
        )
        session.add(schedule)

        # Treatments
        treatments = [
            Treatment(
                hospital_id=hospital.id,
                name="써마지 FLX",
                category="리프팅",
                description="고주파 에너지를 이용하여 피부 깊숙이 열을 전달, 콜라겐 재생을 촉진하여 탄력 있는 피부로 개선합니다.",
                image_url="/images/treatments/thermage.jpg",
                sort_order=1,
            ),
            Treatment(
                hospital_id=hospital.id,
                name="울쎄라피",
                category="리프팅",
                description="초음파 에너지를 이용한 비수술 리프팅 시술로, SMAS층까지 에너지를 전달하여 자연스러운 리프팅 효과를 제공합니다.",
                image_url="/images/treatments/ultherapy.jpg",
                sort_order=2,
            ),
            Treatment(
                hospital_id=hospital.id,
                name="보톡스",
                category="주사",
                description="보툴리눔 톡신을 이용하여 주름 개선, 사각턱 축소, 다한증 치료 등 다양한 효과를 제공합니다.",
                image_url="/images/treatments/botox.jpg",
                sort_order=3,
            ),
            Treatment(
                hospital_id=hospital.id,
                name="필러",
                category="주사",
                description="히알루론산 등의 충전제를 주입하여 볼륨감을 더하고, 주름을 개선하며 얼굴 윤곽을 조절합니다.",
                image_url="/images/treatments/filler.jpg",
                sort_order=4,
            ),
            Treatment(
                hospital_id=hospital.id,
                name="스킨부스터",
                category="피부관리",
                description="히알루론산을 진피층에 직접 주입하여 피부 속부터 촉촉하게 수분을 공급하고, 피부결을 개선합니다.",
                image_url="/images/treatments/skinbooster.jpg",
                sort_order=5,
            ),
        ]
        session.add_all(treatments)

        # Promotions
        promotions = [
            Promotion(
                hospital_id=hospital.id,
                title="보톡스 원데이 특가 이벤트",
                image_url="/images/promotions/botox-event.jpg",
                start_date=date(2026, 4, 1),
                end_date=date(2026, 5, 31),
                is_active=True,
            ),
            Promotion(
                hospital_id=hospital.id,
                title="리프팅 패키지 30% 할인",
                image_url="/images/promotions/lifting-event.jpg",
                start_date=date(2026, 4, 1),
                end_date=date(2026, 6, 30),
                is_active=True,
            ),
            Promotion(
                hospital_id=hospital.id,
                title="필러 시술 2+1 이벤트",
                image_url="/images/promotions/filler-event.jpg",
                start_date=date(2026, 4, 15),
                end_date=date(2026, 5, 15),
                is_active=True,
            ),
        ]
        session.add_all(promotions)

        # Philosophy
        philosophies = [
            Philosophy(
                hospital_id=hospital.id,
                icon="heart",
                title="Healthy",
                title_ko="건강한 아름다움",
                description="건강한 피부를 기반으로 한 아름다움을 추구합니다. 무리한 시술보다 피부 본연의 건강함을 되찾는 것을 우선합니다.",
                sort_order=1,
            ),
            Philosophy(
                hospital_id=hospital.id,
                icon="leaf",
                title="Naturally",
                title_ko="자연스러운 변화",
                description="티 나지 않는 자연스러운 변화를 지향합니다. 본래의 아름다움을 살리는 섬세한 시술을 약속합니다.",
                sort_order=2,
            ),
            Philosophy(
                hospital_id=hospital.id,
                icon="shield",
                title="Safely",
                title_ko="안전한 시술",
                description="모든 시술은 안전을 최우선으로 합니다. 정품 제품만 사용하며, 철저한 위생 관리 아래 시술합니다.",
                sort_order=3,
            ),
            Philosophy(
                hospital_id=hospital.id,
                icon="sparkles",
                title="Beauty",
                title_ko="진정한 아름다움",
                description="외적인 아름다움과 내적인 자신감, 모두를 위한 맞춤형 솔루션을 제공합니다.",
                sort_order=4,
            ),
        ]
        session.add_all(philosophies)

        # Space images
        spaces = [
            SpaceImage(hospital_id=hospital.id, image_url="/images/spaces/lobby.jpg", caption="로비", sort_order=1),
            SpaceImage(hospital_id=hospital.id, image_url="/images/spaces/consulting.jpg", caption="상담실", sort_order=2),
            SpaceImage(hospital_id=hospital.id, image_url="/images/spaces/treatment.jpg", caption="시술실", sort_order=3),
            SpaceImage(hospital_id=hospital.id, image_url="/images/spaces/recovery.jpg", caption="회복실", sort_order=4),
        ]
        session.add_all(spaces)

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
