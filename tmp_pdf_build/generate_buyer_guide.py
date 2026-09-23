from __future__ import annotations

import base64
import io
import os
import re
import shutil
import textwrap
import time
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse

import qrcode
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps, ImageStat
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUTPUT_DIR = ROOT.parent / "tmp_pdf_output"
OUTPUT_PDF = OUTPUT_DIR / "2026_Tokyo_KFashion_Buyer_Guide.pdf"
ASSETS.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
)
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept-Language": "ja,en;q=0.8,ko;q=0.6"})

BRANDS = [
    {
        "no": "01",
        "name": "GOOD TRUST",
        "company": "GOOD TRUST",
        "category": "ゴルフ・アクティブウェア",
        "concept": "ゴルフから日常まで、スポーツとライフスタイルをつなぐアパレルを提案します。",
        "items": "ポロシャツ、ハーフジップ、ベスト、パンツ、スカート、ワンピース、トレーニングウェア",
        "buyers": "ゴルフ、スポーツ、アウトドア、デイリーウェアの専門店・卸・EC",
        "url": "https://www.goodtrust.co.kr/company/product",
        "display_url": "www.goodtrust.co.kr",
        "accent": "#A8BF8B",
    },
    {
        "no": "02",
        "name": "STICO",
        "company": "NANOTECH CERAMICS CO., LTD.",
        "category": "機能性フットウェア",
        "concept": "用途に応じたクロッグ、スリッポン、ワークシューズ、ブーツなどを展開する機能性シューズブランドです。",
        "items": "NECシリーズ、ワークシューズ、クロッグ、レインブーツ、用途別機能性フットウェア",
        "buyers": "医療、外食、ワーク、アウトドア、シューズ専門流通",
        "url": "https://www.sticokorea.com/kr/portfolio-styles/",
        "display_url": "www.sticokorea.com",
        "accent": "#F28A70",
    },
    {
        "no": "03",
        "name": "commacomma",
        "company": "commacomma",
        "category": "シャツ・ブラウス・デニム",
        "concept": "ディテールを活かしたシャツ、ブラウス、スウェット、デニムを展開する韓国ファッションブランドです。",
        "items": "ハートポイントブラウス、カラースウェット、シースルーブラウス、ワイドデニム、パンツ",
        "buyers": "レディースセレクトショップ、EC、コンセプトストア",
        "url": "https://www.commacomma.kr/",
        "display_url": "commacomma.kr / @commacomma_kr",
        "accent": "#E8A8C5",
    },
    {
        "no": "04",
        "name": "ROSENICK",
        "company": "ROSENICK",
        "category": "レディースシューズ",
        "concept": "韓国国内生産のハンドメイドシューズを中心に、パンプス、ローファー、フラット、ブーツを展開します。",
        "items": "メリージェーン、厚底ローファー、リボンフラット、レースアップ、パディングブーツ",
        "buyers": "レディースシューズ、ファッション雑貨、百貨店・セレクトショップ",
        "url": "https://www.rosenick.co.kr/",
        "display_url": "www.rosenick.co.kr / @rosenick_official",
        "accent": "#E6A4BF",
    },
    {
        "no": "05",
        "name": "mon le conte",
        "company": "Sujeongga",
        "category": "ベビーシューズ・ライフスタイル雑貨",
        "concept": "ベビーのファーストシューズを中心に、育児雑貨やギフトアイテムを提案します。",
        "items": "Monbebe Toddle Shoes、ベビーソックスシューズ、おむつバッグ、ギフトアイテム",
        "buyers": "ベビー・キッズ専門店、ギフト、百貨店キッズ、ライフスタイルショップ",
        "url": "https://monleconte.kr/",
        "display_url": "monleconte.kr",
        "accent": "#C8AE77",
    },
    {
        "no": "06",
        "name": "OHGYO（烏橋）",
        "company": "DALMAJI TIGER",
        "category": "メンズ・ウィメンズ・アクセサリー",
        "concept": "韓国の物語性と立体的なアヴァンギャルドデザインを融合するアート＆ファッションブランドです。",
        "items": "レイヤードドレス、アシンメトリーシャツ、ジャケット、サルエルパンツ、SIMジュエリー",
        "buyers": "デザイナーズセレクト、コンセプトストア、アート系リテール・メディア",
        "url": "https://en.ohgyo.com/",
        "display_url": "ohgyo.com / @ohgyo_official",
        "accent": "#AAB9CF",
    },
    {
        "no": "07",
        "name": "REVE BY REVE",
        "company": "PLOT CO., LTD.",
        "category": "レディースシューズ",
        "concept": "日常のコーディネートに上品さを添える、サンダル、パンプス、ローファー、スリングバックを提案します。",
        "items": "entrechat simple sandal、Ava Stiletto、Ronnie Loafer、Ribbon Satin Slingback",
        "buyers": "レディースシューズ、セレクトショップ、百貨店・EC",
        "url": "https://revebyreve.co.kr/",
        "display_url": "revebyreve.co.kr",
        "accent": "#B6A3C9",
    },
    {
        "no": "08",
        "name": "SWIMMABEBE",
        "company": "SMB Co., Ltd.",
        "category": "ベビー＆キッズスイムウェア",
        "concept": "ベビー・キッズ水着を中心に、ファミリーラインやリゾートウェアまで幅広く展開します。",
        "items": "ベビー水着、キッズ水着、ラッシュガード、セットアップ、ファミリーリゾートウェア",
        "buyers": "キッズ、スポーツ、リゾート、ライフスタイル専門流通",
        "url": "https://swimmabebe.com/",
        "display_url": "swimmabebe.com / @swim_ma_bebe",
        "accent": "#8FC5CA",
    },
    {
        "no": "09",
        "name": "REALCOCO",
        "company": "PBR Inc.",
        "category": "レディースファッション",
        "concept": "デイリーからオケージョンまで、ワンピースを中心に幅広い女性向けスタイルを提案します。",
        "items": "花柄ワンピース、シャツワンピース、シフォン、プリーツ、ミニマルドレス",
        "buyers": "レディースEC、セレクトショップ、百貨店オンライン、卸",
        "url": "https://realcoco.com/",
        "display_url": "realcoco.com",
        "accent": "#D2A67F",
    },
    {
        "no": "10",
        "name": "EVID",
        "company": "COOP. DESIGNALL",
        "category": "ストリートウェア・アップサイクル",
        "concept": "グラフィック、刺繍、アートワークを取り入れたカスタムウェアを制作するアートファッションスタジオです。",
        "items": "セットアップ、デニムパンツ、ジャケット、スカート、カスタムデニム、アートワークウェア",
        "buyers": "ストリート、アート、コンセプトストア、アップサイクル関連流通",
        "url": "https://www.instagram.com/evid_studio/",
        "display_url": "@evid_studio / @dive_up_evid",
        "accent": "#9AAF91",
    },
]


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def is_probably_logo_or_icon(url: str) -> bool:
    low = url.lower()
    bad = ["logo", "icon", "favicon", "sprite", "btn_", "button", "arrow", "banner_top"]
    return any(x in low for x in bad)


def fetch_bytes(url: str, timeout: int = 25) -> bytes | None:
    try:
        response = SESSION.get(url, timeout=timeout, allow_redirects=True)
        if response.ok and len(response.content) > 1500:
            return response.content
    except Exception:
        return None
    return None


def save_normalized_image(data: bytes, dest: Path, target=(1200, 840)) -> bool:
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
        w, h = im.size
        if w < 260 or h < 180:
            return False
        if max(w, h) / max(1, min(w, h)) > 5.5:
            return False
        stat = ImageStat.Stat(im.resize((64, 64)))
        if sum(stat.var) < 65:
            return False
        im = ImageOps.fit(im, target, method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))
        im = ImageEnhance.Contrast(im).enhance(1.02)
        im.save(dest, "JPEG", quality=88, optimize=True)
        return True
    except Exception:
        return False


def scrape_candidate_urls(page_url: str) -> list[str]:
    try:
        r = SESSION.get(page_url, timeout=30, allow_redirects=True)
        if not r.ok:
            return []
        soup = BeautifulSoup(r.text, "html.parser")
        candidates: list[str] = []
        for key, attr in [
            (("meta", {"property": "og:image"}), "content"),
            (("meta", {"name": "twitter:image"}), "content"),
            (("meta", {"property": "twitter:image"}), "content"),
        ]:
            node = soup.find(*key)
            if node and node.get(attr):
                candidates.append(urljoin(r.url, node.get(attr)))
        for img in soup.find_all("img"):
            src = (
                img.get("data-src")
                or img.get("data-original")
                or img.get("data-lazy")
                or img.get("ec-data-src")
                or img.get("src")
            )
            if not src or src.startswith("data:"):
                continue
            candidates.append(urljoin(r.url, src))
        unique: list[str] = []
        for u in candidates:
            if not u.startswith("http") or is_probably_logo_or_icon(u):
                continue
            if u not in unique:
                unique.append(u)
        return unique[:80]
    except Exception:
        return []


def screenshot_bytes(url: str) -> bytes | None:
    services = [
        f"https://image.thum.io/get/width/1600/crop/1400/noanimate/{url}",
        f"https://s.wordpress.com/mshots/v1/{quote(url, safe='')}?w=1600",
    ]
    for shot in services:
        data = fetch_bytes(shot, timeout=60)
        if data:
            try:
                im = Image.open(io.BytesIO(data))
                if im.width >= 700 and im.height >= 500:
                    return data
            except Exception:
                pass
    return None


def create_abstract_placeholder(brand: dict, dest: Path, seed: int) -> None:
    bg = Image.new("RGB", (1200, 840), "#F1EEE7")
    draw = ImageDraw.Draw(bg)
    accent = brand["accent"]
    # Abstract product-card composition, used only if remote imagery is unavailable.
    draw.rounded_rectangle((70, 65, 1130, 775), radius=38, fill="#FAF9F5", outline=accent, width=8)
    for i in range(5):
        x = 130 + ((seed * 113 + i * 181) % 760)
        y = 120 + ((seed * 97 + i * 127) % 460)
        r = 65 + (i % 3) * 24
        draw.ellipse((x, y, x + r * 2, y + r * 2), fill=accent)
    draw.rectangle((150, 610, 1050, 700), fill="#FFFFFF")
    draw.text((180, 626), brand["name"], fill="#202020")
    bg.save(dest, "JPEG", quality=88)


def create_crops_from_screenshot(data: bytes, brand: dict, out_dir: Path, start_index: int) -> list[Path]:
    paths: list[Path] = []
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
        # Remove likely browser/header whitespace where possible.
        if im.height > 900:
            im = im.crop((0, min(80, im.height // 12), im.width, im.height))
        cols, rows = 2, 3
        cw, ch = im.width / cols, im.height / rows
        for row in range(rows):
            for col in range(cols):
                left = int(col * cw)
                top = int(row * ch)
                right = int((col + 1) * cw)
                bottom = int((row + 1) * ch)
                crop = im.crop((left, top, right, bottom))
                crop = ImageOps.fit(crop, (1200, 840), method=Image.Resampling.LANCZOS)
                crop = ImageEnhance.Contrast(crop).enhance(1.03)
                dest = out_dir / f"{start_index + len(paths):02d}.jpg"
                crop.save(dest, "JPEG", quality=87, optimize=True)
                paths.append(dest)
    except Exception:
        pass
    return paths


def collect_brand_images(brand: dict) -> list[Path]:
    slug = re.sub(r"[^a-z0-9]+", "_", brand["name"].lower()).strip("_") or brand["no"]
    out_dir = ASSETS / slug
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []

    for idx, image_url in enumerate(scrape_candidate_urls(brand["url"])):
        if len(paths) >= 6:
            break
        data = fetch_bytes(image_url)
        if not data:
            continue
        dest = out_dir / f"{len(paths):02d}.jpg"
        if save_normalized_image(data, dest):
            paths.append(dest)
        time.sleep(0.05)

    if len(paths) < 6:
        shot = screenshot_bytes(brand["url"])
        if shot:
            crops = create_crops_from_screenshot(shot, brand, out_dir, len(paths))
            for p in crops:
                if len(paths) < 6:
                    paths.append(p)

    while len(paths) < 6:
        dest = out_dir / f"{len(paths):02d}.jpg"
        create_abstract_placeholder(brand, dest, seed=int(brand["no"]) * 10 + len(paths))
        paths.append(dest)
    return paths[:6]


def image_uri(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def html_escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def build_qr() -> Path:
    subject = quote("2026 Tokyo K-Fashion Buyer Application")
    body = quote("会社名：\n部署・役職：\n氏名：\n来場希望日・時間：\n関心カテゴリー：\n名刺データを添付します。")
    target = f"mailto:linkon@linkonkr.com?subject={subject}&body={body}"
    qr = qrcode.QRCode(version=None, box_size=9, border=2)
    qr.add_data(target)
    qr.make(fit=True)
    im = qr.make_image(fill_color="#151515", back_color="white").convert("RGB")
    path = ASSETS / "application_qr.jpg"
    im.save(path, "JPEG", quality=95)
    return path


def page_footer(page_no: int) -> str:
    return f"""
    <div class="footer">
      <span>2026 TOKYO K-FASHION / BUYER GUIDE</span>
      <span>{page_no:02d}</span>
    </div>
    """


def render_cover(all_images: dict[str, list[Path]]) -> str:
    hero_images = [all_images[b["name"]][0] for b in BRANDS]
    tiles = "".join(
        f'<div class="cover-tile"><img src="{image_uri(p)}"></div>' for p in hero_images
    )
    return f"""
    <section class="page cover">
      <div class="cover-kicker">BUYER &amp; DISTRIBUTION PARTNER GUIDE</div>
      <h1>2026 TOKYO<br>K-FASHION</h1>
      <div class="cover-subtitle">POP-UP SHOWROOM &amp; BUSINESS MATCHING</div>
      <div class="cover-rule"></div>
      <div class="cover-meta">
        <div><b>2026.10.08 THU</b><span>11:00–19:00</span></div>
        <div><b>2026.10.09 FRI</b><span>09:00–19:00</span></div>
        <div><b>OMOTESANDO</b><span>KOH’S LICK CURRO 2F</span></div>
      </div>
      <div class="cover-grid">{tiles}</div>
      <div class="cover-bottom">
        <span>韓国・釜山発 ファッションブランド10社</span>
        <span>入場無料 / 事前申込制</span>
      </div>
      {page_footer(1)}
    </section>
    """


def render_overview(all_images: dict[str, list[Path]]) -> str:
    mosaic = "".join(
        f'<div class="overview-img"><img src="{image_uri(all_images[b["name"]][1])}"></div>'
        for b in BRANDS[:6]
    )
    return f"""
    <section class="page overview-page">
      <div class="section-kicker">EVENT OVERVIEW</div>
      <h2>日本のバイヤー・流通関係者の皆様へ</h2>
      <p class="lead">韓国・釜山地域のファッション企業10社が東京・表参道に集結。商品を実際にご覧いただき、ブランド担当者との商談や今後の取引可能性をご検討いただける2日間です。</p>
      <div class="overview-layout">
        <div class="event-card">
          <div class="event-row"><span>開催日</span><b>2026年10月8日（木）11:00–19:00<br>2026年10月9日（金）09:00–19:00</b></div>
          <div class="event-row"><span>会場</span><b>Omotesando KOH’S LICK CURRO 2F<br>東京都渋谷区神宮前5-7-13</b></div>
          <div class="event-row"><span>内容</span><b>商品展示 / B2B商談 / ブランド紹介<br>ネットワーキング / 一部サンプル購入</b></div>
          <div class="event-row"><span>対応</span><b>会場内で日本語通訳対応<br>関心カテゴリーに応じたブランド紹介</b></div>
          <div class="event-row"><span>参加費</span><b>無料（事前申込・選定制）</b></div>
        </div>
        <div class="overview-mosaic">{mosaic}</div>
      </div>
      <div class="benefits">
        <div><strong>10</strong><span>韓国ファッション<br>参加ブランド</span></div>
        <div><strong>1:1</strong><span>ブランド担当者との<br>B2B商談</span></div>
        <div><strong>¥18,000</strong><span>選定バイヤー1社1名<br>交通費補助</span></div>
        <div><strong>10/1</strong><span>参加申込締切<br>名刺提出必須</span></div>
      </div>
      <div class="organizer-note">主催：釜山地方中小ベンチャー企業庁　　主管：釜山繊維ファッション産業連合会　　バイヤー招待窓口：Linkon</div>
      {page_footer(2)}
    </section>
    """


def render_brand(brand: dict, images: list[Path], page_no: int) -> str:
    image_tiles = "".join(
        f'<div class="brand-img"><img src="{image_uri(p)}"></div>' for p in images
    )
    return f"""
    <section class="page brand-page" style="--accent:{brand['accent']}">
      <div class="accent-line"></div>
      <div class="brand-header">
        <div class="brand-no">{brand['no']} / BRAND &amp; ITEMS</div>
        <h2>{html_escape(brand['name'])}</h2>
        <div class="brand-company">COMPANY / {html_escape(brand['company'])}</div>
        <div class="brand-category">{html_escape(brand['category'])}</div>
      </div>
      <div class="brand-grid">{image_tiles}</div>
      <div class="brand-info">
        <div class="brand-concept">{html_escape(brand['concept'])}</div>
        <div class="info-cols">
          <div><span>主なアイテム</span><p>{html_escape(brand['items'])}</p></div>
          <div><span>想定バイヤー</span><p>{html_escape(brand['buyers'])}</p></div>
        </div>
        <div class="trade-row"><b>取引情報</b><span>卸価格・MOQ・納期・日本展開条件等は会場商談で個別にご案内します。</span></div>
        <div class="site-row">{html_escape(brand['display_url'])}</div>
      </div>
      {page_footer(page_no)}
    </section>
    """


def render_application(qr_path: Path) -> str:
    return f"""
    <section class="page application-page">
      <div class="section-kicker">BUYER APPLICATION</div>
      <h2>バイヤー参加申込・交通費補助</h2>
      <div class="application-layout">
        <div class="steps">
          <div class="step"><b>01</b><div><strong>招待メールに返信</strong><span>2026年10月1日（木）までにお申し込みください。</span></div></div>
          <div class="step"><b>02</b><div><strong>名刺データを添付</strong><span>会社名・部署・役職・氏名を確認できる名刺画像またはPDFをお送りください。</span></div></div>
          <div class="step"><b>03</b><div><strong>Linkonによる確認・選定</strong><span>所属企業、業態、役職等を確認し、参加確定者へ個別にメールでご案内します。</span></div></div>
          <div class="step"><b>04</b><div><strong>イベント当日にご来場</strong><span>参加確定メールを受けたご本人が会場へお越しください。</span></div></div>
        </div>
        <div class="qr-card">
          <img src="{image_uri(qr_path)}">
          <b>メール申込</b>
          <span>QRコードを読み取り、必要事項を入力して名刺データを添付してください。</span>
        </div>
      </div>
      <div class="subsidy-box">
        <div class="subsidy-amount">¥18,000</div>
        <div class="subsidy-copy">
          <h3>選定されたバイヤー企業への交通費補助</h3>
          <ul>
            <li>バイヤー企業1社につき、来場者1名を対象に会場で日本円の現金をお渡しします。</li>
            <li>同一企業から複数名でご来場の場合も、支給対象は1名のみです。</li>
            <li>商談・商品の購入は必須ではありません。</li>
            <li>受領後の使途は自由で、会場内の一部出展商品のサンプル購入にもご利用いただけます。</li>
            <li>勤務先の社内規程により現金を受領できない場合があります。事前にご確認ください。</li>
          </ul>
        </div>
      </div>
      <div class="contact-card">
        <div>
          <span>BUYER INVITATION CONTACT</span>
          <h3>Linkon</h3>
          <p>代表　キム・ビョンス</p>
        </div>
        <div class="contact-details">
          <p><b>E-mail</b> linkon@linkonkr.com</p>
          <p><b>Tel.</b> +82 10 4760 5789</p>
          <p><b>Web</b> pre.linkon.com</p>
        </div>
      </div>
      <div class="fine-print">ご送付いただいた名刺情報は、本イベントの参加確認、選定結果のご連絡および当日の本人確認の目的にのみ使用します。掲載画像は提供資料および各社公開情報をもとに編集しています。会場での展示・販売商品、在庫、価格は変更される場合があります。</div>
      {page_footer(13)}
    </section>
    """


def build_html(all_images: dict[str, list[Path]], qr_path: Path) -> str:
    pages = [render_cover(all_images), render_overview(all_images)]
    for idx, brand in enumerate(BRANDS, start=3):
        pages.append(render_brand(brand, all_images[brand["name"]], idx))
    pages.append(render_application(qr_path))
    css = r"""
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif; color: #202020; background: #ddd; }
    .page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; background: #F6F4EE; padding: 15mm 14mm 13mm; }
    .page:last-child { page-break-after: auto; }
    .footer { position: absolute; left: 14mm; right: 14mm; bottom: 7mm; display: flex; justify-content: space-between; align-items: center; padding-top: 2.2mm; border-top: .25mm solid #B7B3AA; color: #5E5A53; font-size: 7.5pt; letter-spacing: .04em; }
    .section-kicker { font-size: 9pt; letter-spacing: .16em; font-weight: 700; color: #6B675F; margin-bottom: 4mm; }
    h1, h2, h3, p { margin: 0; }
    .cover { background: #F4F1EA; padding-top: 16mm; }
    .cover-kicker { font-size: 8.5pt; letter-spacing: .2em; font-weight: 700; color: #6E6A62; }
    .cover h1 { margin-top: 7mm; font-size: 38pt; line-height: .95; letter-spacing: -.03em; font-weight: 700; }
    .cover-subtitle { margin-top: 4mm; font-size: 14pt; letter-spacing: .05em; font-weight: 500; }
    .cover-rule { width: 37mm; height: 1.3mm; background: #151515; margin: 6mm 0; }
    .cover-meta { display: flex; gap: 11mm; font-size: 8pt; margin-bottom: 8mm; }
    .cover-meta div { display: flex; flex-direction: column; gap: .8mm; }
    .cover-meta b { font-size: 9.2pt; letter-spacing: .04em; }
    .cover-meta span { color: #5D5952; }
    .cover-grid { display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 45mm); gap: 2.5mm; }
    .cover-tile { overflow: hidden; background: #fff; }
    .cover-tile img { width: 100%; height: 100%; object-fit: cover; }
    .cover-bottom { display: flex; justify-content: space-between; margin-top: 5mm; font-size: 8.5pt; font-weight: 600; }
    .overview-page h2, .application-page h2 { font-size: 25pt; line-height: 1.2; margin-bottom: 4mm; }
    .lead { font-size: 10.5pt; line-height: 1.75; width: 174mm; color: #46423C; margin-bottom: 7mm; }
    .overview-layout { display: grid; grid-template-columns: 76mm 1fr; gap: 6mm; }
    .event-card { background: #fff; border: .35mm solid #D8D3C9; padding: 4.5mm 5mm; }
    .event-row { padding: 3.4mm 0; border-bottom: .25mm solid #E5E0D7; }
    .event-row:last-child { border-bottom: none; }
    .event-row span { display: block; font-size: 7.5pt; letter-spacing: .12em; color: #807A70; margin-bottom: 1.3mm; }
    .event-row b { font-size: 9pt; line-height: 1.55; font-weight: 600; }
    .overview-mosaic { display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 42mm); gap: 2.5mm; }
    .overview-img { overflow: hidden; background: #fff; }
    .overview-img img { width: 100%; height: 100%; object-fit: cover; }
    .benefits { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 7mm; border-top: .45mm solid #222; border-bottom: .45mm solid #222; padding: 4mm 0; }
    .benefits div { padding: 0 4mm; border-right: .25mm solid #C6C1B7; display: flex; align-items: center; gap: 3mm; }
    .benefits div:last-child { border-right: none; }
    .benefits strong { font-size: 18pt; line-height: 1; }
    .benefits span { font-size: 8pt; line-height: 1.45; }
    .organizer-note { margin-top: 4mm; color: #5E5A52; font-size: 7.4pt; }
    .brand-page { padding-top: 12mm; }
    .accent-line { position: absolute; left: 0; right: 0; top: 0; height: 2.5mm; background: var(--accent); }
    .brand-no { font-size: 8.5pt; letter-spacing: .1em; color: #5F5A53; margin-bottom: 3mm; }
    .brand-header h2 { font-size: 28pt; line-height: 1.05; letter-spacing: -.02em; }
    .brand-company { margin-top: 1.5mm; font-size: 7.4pt; letter-spacing: .06em; color: #777168; }
    .brand-category { margin-top: 2.5mm; font-size: 12pt; font-weight: 600; }
    .brand-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 50mm); gap: 2.7mm; margin-top: 7mm; }
    .brand-img { overflow: hidden; background: #fff; border: .2mm solid #E4E0D8; }
    .brand-img img { width: 100%; height: 100%; object-fit: cover; }
    .brand-info { margin-top: 5.5mm; border-top: .55mm solid #222; padding-top: 4mm; }
    .brand-concept { font-size: 10pt; line-height: 1.65; font-weight: 600; }
    .info-cols { display: grid; grid-template-columns: 1.15fr .85fr; gap: 8mm; margin-top: 3mm; }
    .info-cols span { display: block; font-size: 7.5pt; letter-spacing: .1em; color: #716B62; font-weight: 700; margin-bottom: 1mm; }
    .info-cols p { font-size: 8.3pt; line-height: 1.55; }
    .trade-row { display: flex; gap: 3.5mm; margin-top: 3.2mm; padding: 2.4mm 3mm; background: color-mix(in srgb, var(--accent) 16%, white); font-size: 7.9pt; line-height: 1.45; }
    .trade-row b { white-space: nowrap; }
    .site-row { margin-top: 2.3mm; font-size: 7.7pt; color: #4A4640; }
    .application-page { background: #F3F0E8; }
    .application-layout { display: grid; grid-template-columns: 1fr 51mm; gap: 7mm; margin-top: 7mm; }
    .steps { display: flex; flex-direction: column; gap: 3mm; }
    .step { display: grid; grid-template-columns: 13mm 1fr; background: #fff; border: .25mm solid #D8D2C8; padding: 3mm 4mm; align-items: start; }
    .step > b { font-size: 17pt; line-height: 1; }
    .step strong { display: block; font-size: 9.5pt; margin-bottom: 1mm; }
    .step span { display: block; font-size: 8pt; line-height: 1.45; color: #555047; }
    .qr-card { background: #fff; border: .35mm solid #222; padding: 5mm; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .qr-card img { width: 35mm; height: 35mm; margin-bottom: 3mm; }
    .qr-card b { font-size: 10pt; }
    .qr-card span { margin-top: 1.5mm; font-size: 7.2pt; line-height: 1.45; color: #615C54; }
    .subsidy-box { display: grid; grid-template-columns: 48mm 1fr; margin-top: 7mm; background: #202020; color: white; }
    .subsidy-amount { display: flex; align-items: center; justify-content: center; font-size: 26pt; font-weight: 700; border-right: .3mm solid #666; }
    .subsidy-copy { padding: 5mm 6mm; }
    .subsidy-copy h3 { font-size: 12pt; margin-bottom: 2mm; }
    .subsidy-copy ul { margin: 0; padding-left: 5mm; }
    .subsidy-copy li { font-size: 7.8pt; line-height: 1.55; margin-bottom: .8mm; }
    .contact-card { margin-top: 7mm; display: grid; grid-template-columns: 1fr 1fr; border-top: .55mm solid #222; border-bottom: .55mm solid #222; padding: 4mm 0; }
    .contact-card span { font-size: 7.5pt; letter-spacing: .12em; color: #6D675F; }
    .contact-card h3 { font-size: 20pt; margin-top: 1mm; }
    .contact-card p { font-size: 8.5pt; line-height: 1.6; }
    .contact-details { padding-left: 8mm; border-left: .25mm solid #BBB4A9; }
    .fine-print { margin-top: 4mm; font-size: 6.8pt; line-height: 1.55; color: #625D55; }
    """
    return "<!doctype html><html lang='ja'><head><meta charset='utf-8'><style>" + css + "</style></head><body>" + "".join(pages) + "</body></html>"


def main() -> None:
    all_images: dict[str, list[Path]] = {}
    for brand in BRANDS:
        print(f"Collecting images for {brand['name']}...")
        all_images[brand["name"]] = collect_brand_images(brand)
    qr_path = build_qr()
    html = build_html(all_images, qr_path)
    html_path = ROOT / "buyer_guide.html"
    html_path.write_text(html, encoding="utf-8")
    HTML(filename=str(html_path), base_url=str(ROOT)).write_pdf(str(OUTPUT_PDF))
    print(f"Created: {OUTPUT_PDF} ({OUTPUT_PDF.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
