from __future__ import annotations

import io
import json
import re
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse

import qrcode
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat

try:
    import instaloader
except Exception:  # pragma: no cover
    instaloader = None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "generated"
CACHE = ROOT / ".buyer_guide_cache_v2"
OUT.mkdir(exist_ok=True)
CACHE.mkdir(exist_ok=True)

PDF_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide.pdf"
PREVIEW_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide_preview.png"
CONTACT_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide_contact_sheet.jpg"
REPORT_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide_image_sources.json"

W, H = 1654, 2339
M = 105
BG = "#F4F1E9"
INK = "#20201E"
MUTED = "#6B665E"
LINE = "#D0CAC0"
WHITE = "#FFFFFF"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    "Accept-Language": "ja,en;q=0.8,ko;q=0.6",
})

BRANDS = [
    {
        "no": "01", "name": "GOOD TRUST", "company": "GOOD TRUST",
        "category": "ゴルフ・アクティブウェア", "accent": "#AFC58F",
        "concept": "ゴルフから日常まで、スポーツとライフスタイルをつなぐアパレルを提案します。",
        "items": "ポロシャツ、ハーフジップ、ベスト、パンツ、スカート、ワンピース、トレーニングウェア、軽量アウター",
        "buyers": "ゴルフ、スポーツ、アウトドア、デイリーウェアの専門店・卸・EC",
        "url": "https://www.goodtrust.co.kr/company/product", "display": "www.goodtrust.co.kr",
    },
    {
        "no": "02", "name": "STICO", "company": "NANOTECH CERAMICS CO., LTD.",
        "category": "機能性フットウェア", "accent": "#FF8B73",
        "concept": "クロッグ、スリッポン、ワークシューズ、ブーツなどを展開する機能性シューズブランドです。",
        "items": "NECシリーズ、ワークシューズ、クロッグ、レインブーツ、用途別機能性フットウェア",
        "buyers": "医療、外食、ワーク、アウトドア、シューズ専門流通",
        "url": "https://www.sticokorea.com/kr/portfolio-styles/", "display": "www.sticokorea.com",
    },
    {
        "no": "03", "name": "commacomma", "company": "commacomma",
        "category": "シャツ・ブラウス・デニム", "accent": "#E9A8C6",
        "concept": "ディテールを活かしたシャツ、ブラウス、スウェット、デニムを展開する韓国ファッションブランドです。",
        "items": "ハートポイントブラウス、カラースウェット、シースルーブラウス、ワイドデニム、パンツ、スカート",
        "buyers": "レディースセレクトショップ、EC、コンセプトストア",
        "url": "https://www.commacomma.kr/", "display": "commacomma.kr / @commacomma_kr",
    },
    {
        "no": "04", "name": "ROSENICK", "company": "ROSENICK",
        "category": "レディースシューズ", "accent": "#E68FB6",
        "concept": "韓国国内生産のハンドメイドシューズを中心に、パンプス、ローファー、フラット、ブーツを展開します。",
        "items": "メリージェーン、厚底ローファー、リボンフラット、レースアップ、メッシュスニーカー、パディングブーツ",
        "buyers": "レディースシューズ、ファッション雑貨、百貨店・セレクトショップ",
        "url": "https://www.rosenick.co.kr/", "display": "www.rosenick.co.kr / @rosenick_official",
    },
    {
        "no": "05", "name": "Sujeongga / mon le conte", "company": "Sujeongga",
        "category": "ベビーシューズ・ライフスタイル雑貨", "accent": "#CDB67A",
        "concept": "ベビーのファーストシューズを中心に、育児雑貨やギフトアイテムを提案します。",
        "items": "Monbebe Toddle Shoes、ベビーソックスシューズ、おむつバッグ、育児雑貨、ギフトアイテム",
        "buyers": "ベビー・キッズ専門店、ギフト、百貨店キッズ、ライフスタイルショップ",
        "url": "https://monleconte.kr/", "display": "monleconte.kr",
    },
    {
        "no": "06", "name": "OHGYO（烏橋）", "company": "DALMAJI TIGER",
        "category": "メンズ・ウィメンズ・アクセサリー", "accent": "#A9BBD3",
        "concept": "韓国の物語性と立体的なアヴァンギャルドデザインを融合するアート＆ファッションブランドです。",
        "items": "レイヤードドレス、アシンメトリーシャツ、ジャケット、サルエルパンツ、ネックレス、リング",
        "buyers": "デザイナーズセレクト、コンセプトストア、アート系リテール・メディア",
        "url": "https://en.ohgyo.com/", "display": "ohgyo.com / @ohgyo_official",
    },
    {
        "no": "07", "name": "REVE BY REVE", "company": "PLOT CO., LTD.",
        "category": "レディースシューズ", "accent": "#B5A0C8",
        "concept": "日常のコーディネートに上品さを添える、サンダル、パンプス、ローファー、スリングバックを提案します。",
        "items": "entrechat simple sandal、Ava Stiletto、Ronnie Loafer、Ribbon Satin Slingback",
        "buyers": "レディースシューズ、セレクトショップ、百貨店・EC",
        "url": "https://revebyreve.co.kr/", "display": "revebyreve.co.kr",
    },
    {
        "no": "08", "name": "SWIMMABEBE", "company": "SMB Co., Ltd.",
        "category": "ベビー＆キッズスイムウェア", "accent": "#8CC7CE",
        "concept": "ベビー・キッズ水着を中心に、ファミリーラインやリゾートウェアまで幅広く展開します。",
        "items": "ベビー水着、キッズ水着、ラッシュガード、セットアップ、ファミリーリゾートウェア",
        "buyers": "キッズ、スポーツ、リゾート、ライフスタイル専門流通",
        "url": "https://swimmabebe.com/", "display": "swimmabebe.com / @swim_ma_bebe",
    },
    {
        "no": "09", "name": "REALCOCO", "company": "PBR Inc.",
        "category": "レディースファッション", "accent": "#D6A478",
        "concept": "デイリーからオケージョンまで、ワンピースを中心に幅広い女性向けスタイルを提案します。",
        "items": "花柄ワンピース、シャツワンピース、シフォン、プリーツ、ミニマルドレス、ブラウス、ニット",
        "buyers": "レディースEC、セレクトショップ、百貨店オンライン、卸",
        "url": "https://realcoco.com/", "display": "realcoco.com",
    },
    {
        "no": "10", "name": "EVID", "company": "COOP. DESIGNALL",
        "category": "ストリートウェア・アップサイクル", "accent": "#9BAE90",
        "concept": "グラフィック、刺繍、アートワークを取り入れたカスタムウェアを制作するアートファッションスタジオです。",
        "items": "セットアップ、デニムパンツ、ジャケット、スカート、カスタムデニム、アートワークウェア",
        "buyers": "ストリート、アート、コンセプトストア、アップサイクル関連流通",
        "url": "https://www.instagram.com/evid_studio/", "display": "Instagram @evid_studio / @dive_up_evid",
        "instagram": ["evid_studio", "dive_up_evid"],
    },
]


def font_path(bold: bool = False) -> str:
    options = [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Bold.otf" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for option in options:
        if Path(option).exists():
            return option
    raise FileNotFoundError("No usable CJK font found")


REG = font_path(False)
BOLD = font_path(True)


def f(size: int, bold: bool = False):
    return ImageFont.truetype(BOLD if bold else REG, size)


def rounded(draw, xy, radius=22, fill=WHITE, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def contain(im: Image.Image, size: tuple[int, int], padding: int = 20, bg=WHITE) -> Image.Image:
    """Place the complete product photo inside a white tile without cropping."""
    canvas = Image.new("RGB", size, bg)
    cp = im.convert("RGB")
    max_size = (max(1, size[0] - 2 * padding), max(1, size[1] - 2 * padding))
    cp.thumbnail(max_size, Image.Resampling.LANCZOS)
    x = (size[0] - cp.width) // 2
    y = (size[1] - cp.height) // 2
    canvas.paste(cp, (x, y))
    return canvas


def crop_preview(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im.convert("RGB"), size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.4))


def wrapped(draw, text, xy, width, font, fill=INK, spacing=10, max_lines=None):
    lines, current = [], ""
    for char in text:
        test = current + char
        if not current or draw.textbbox((0, 0), test, font=font)[2] <= width:
            current = test
        else:
            lines.append(current)
            current = char
    if current:
        lines.append(current)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1][:-1] + "…"
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + spacing
    return y


def normalize_url(src: str, base_url: str) -> str | None:
    if not src or src.startswith("data:"):
        return None
    src = src.strip().replace("&amp;", "&")
    if src.startswith("//"):
        src = "https:" + src
    return urljoin(base_url, src)


def largest_srcset(value: str, base_url: str) -> str | None:
    choices = []
    for item in (value or "").split(","):
        item = item.strip()
        if not item:
            continue
        parts = item.split()
        url = normalize_url(parts[0], base_url)
        score = 0
        if len(parts) > 1:
            score_text = re.sub(r"[^0-9.]", "", parts[1])
            try:
                score = float(score_text)
            except Exception:
                score = 0
        if url:
            choices.append((score, url))
    return max(choices, default=(0, None))[1]


BANNED = (
    "logo", "icon", "favicon", "sprite", "arrow", "button", "btn_", "loading",
    "banner", "coupon", "membership", "payment", "footer", "header", "nav_", "quick",
    "kakao", "youtube", "facebook", "instagram_icon", "review", "board", "event",
)
PRODUCT_HINTS = (
    "product", "prd", "goods", "item", "detail", "catalog", "collection", "lookbook",
    "shop", "thumb", "thumbnail", "listing", "portfolio", "model", "wear", "shoes",
)


def page_image_candidates(page_url: str) -> tuple[list[dict], list[str]]:
    try:
        response = SESSION.get(page_url, timeout=35, allow_redirects=True)
        if not response.ok:
            return [], []
        soup = BeautifulSoup(response.text, "html.parser")
        candidates: list[dict] = []
        product_pages: list[str] = []

        for anchor in soup.find_all("a", href=True):
            href = normalize_url(anchor.get("href"), response.url)
            if not href:
                continue
            low = href.lower()
            if any(token in low for token in ("product", "goods", "item", "detail", "shop")):
                if urlparse(href).netloc == urlparse(response.url).netloc and href not in product_pages:
                    product_pages.append(href)

        for attrs in ({"property": "og:image"}, {"name": "twitter:image"}):
            node = soup.find("meta", attrs=attrs)
            if node and node.get("content"):
                url = normalize_url(node.get("content"), response.url)
                if url:
                    candidates.append({"url": url, "score": 3, "context": "meta product image", "page": response.url})

        for img in soup.find_all("img"):
            src = largest_srcset(img.get("srcset", ""), response.url)
            if not src:
                src = normalize_url(
                    img.get("data-src") or img.get("data-original") or img.get("data-lazy")
                    or img.get("ec-data-src") or img.get("data-image") or img.get("src"),
                    response.url,
                )
            if not src:
                continue
            context = " ".join([
                src, img.get("alt", ""), " ".join(img.get("class", [])), img.get("id", ""),
                " ".join((img.parent.get("class", []) if getattr(img, "parent", None) else [])),
            ]).lower()
            if any(word in context for word in BANNED):
                continue
            score = 0
            score += sum(2 for word in PRODUCT_HINTS if word in context)
            try:
                width = int(re.sub(r"\D", "", str(img.get("width", "0"))) or 0)
                height = int(re.sub(r"\D", "", str(img.get("height", "0"))) or 0)
                if min(width, height) >= 400:
                    score += 3
            except Exception:
                pass
            candidates.append({"url": src, "score": score, "context": context[:240], "page": response.url})

        unique: dict[str, dict] = {}
        for item in candidates:
            existing = unique.get(item["url"])
            if not existing or item["score"] > existing["score"]:
                unique[item["url"]] = item
        return sorted(unique.values(), key=lambda x: x["score"], reverse=True), product_pages[:18]
    except Exception:
        return [], []


def image_hash(im: Image.Image) -> tuple[int, ...]:
    thumb = ImageOps.fit(im.convert("L"), (24, 24), method=Image.Resampling.LANCZOS)
    mean = sum(thumb.getdata()) / (24 * 24)
    return tuple(1 if pixel >= mean else 0 for pixel in thumb.getdata())


def hamming(a, b) -> int:
    return sum(x != y for x, y in zip(a, b))


def download_product_image(item: dict, referer: str | None = None) -> tuple[Image.Image, dict] | None:
    try:
        headers = {"Referer": referer or item.get("page") or "https://www.google.com/"}
        response = SESSION.get(item["url"], timeout=35, allow_redirects=True, headers=headers)
        if not response.ok or len(response.content) < 3500:
            return None
        im = Image.open(io.BytesIO(response.content)).convert("RGB")
        if im.width < 300 or im.height < 240:
            return None
        ratio = im.width / max(1, im.height)
        if ratio < 0.42 or ratio > 2.25:
            return None
        variance = sum(ImageStat.Stat(im.resize((64, 64))).var)
        if variance < 38:
            return None
        meta = {
            "image_url": response.url,
            "source_page": item.get("page"),
            "width": im.width,
            "height": im.height,
            "origin": item.get("origin", "official_website"),
            "context": item.get("context", "")[:180],
        }
        return im, meta
    except Exception:
        return None


def collect_website_images(brand: dict, count: int = 8) -> list[tuple[Image.Image, dict]]:
    base_candidates, linked_pages = page_image_candidates(brand["url"])
    all_candidates = list(base_candidates)
    for page_url in linked_pages[:12]:
        more, _ = page_image_candidates(page_url)
        for item in more:
            item["score"] += 4
        all_candidates.extend(more)
    unique = {}
    for item in all_candidates:
        item["origin"] = "official_website"
        if item["url"] not in unique or item["score"] > unique[item["url"]]["score"]:
            unique[item["url"]] = item
    ranked = sorted(unique.values(), key=lambda x: x["score"], reverse=True)

    selected: list[tuple[Image.Image, dict]] = []
    hashes = []
    for item in ranked:
        downloaded = download_product_image(item, brand["url"])
        if not downloaded:
            continue
        im, meta = downloaded
        current_hash = image_hash(im)
        if any(hamming(current_hash, previous) < 38 for previous in hashes):
            continue
        hashes.append(current_hash)
        selected.append((im, meta))
        if len(selected) >= count:
            break
    if len(selected) < 3:
        raise RuntimeError(f"Not enough direct product photos found for {brand['name']}: {len(selected)}")
    while len(selected) < count:
        original = selected[len(selected) % len(selected)]
        selected.append((original[0].copy(), dict(original[1], repeated=True)))
    return selected[:count]


def recursive_instagram_urls(value, found: set[str]):
    if isinstance(value, dict):
        for key, item in value.items():
            if key in {"display_url", "thumbnail_src", "url"} and isinstance(item, str):
                low = item.lower()
                if item.startswith("http") and any(ext in low for ext in (".jpg", ".jpeg", ".webp")):
                    found.add(item.replace("\\u0026", "&").replace("\\/", "/"))
            recursive_instagram_urls(item, found)
    elif isinstance(value, list):
        for item in value:
            recursive_instagram_urls(item, found)


def instagram_api_candidates(handle: str) -> list[dict]:
    output = []
    for url in (
        f"https://www.instagram.com/{handle}/?__a=1&__d=dis",
        f"https://www.instagram.com/{handle}/?hl=en",
    ):
        try:
            response = SESSION.get(url, timeout=35, headers={
                "User-Agent": SESSION.headers["User-Agent"],
                "X-IG-App-ID": "936619743392459",
                "Referer": f"https://www.instagram.com/{handle}/",
            })
            found: set[str] = set()
            try:
                recursive_instagram_urls(response.json(), found)
            except Exception:
                text = response.text.replace("\\u0026", "&").replace("\\/", "/")
                for match in re.findall(r"https://[^\"'<>\\ ]+(?:jpg|jpeg|webp)[^\"'<>\\ ]*", text, flags=re.I):
                    found.add(match)
            for image_url in found:
                output.append({
                    "url": image_url,
                    "page": f"https://www.instagram.com/{handle}/",
                    "context": f"Instagram @{handle}",
                    "origin": f"instagram:@{handle}",
                    "score": 20,
                })
        except Exception:
            continue
    return output


def instagram_mirror_candidates(handle: str) -> list[dict]:
    output = []
    mirror_pages = [
        f"https://imginn.com/{handle}/",
        f"https://www.picuki.com/profile/{handle}",
        f"https://dumpor.io/v/{handle}",
    ]
    for page in mirror_pages:
        candidates, _ = page_image_candidates(page)
        for item in candidates:
            item["origin"] = f"instagram_mirror:@{handle}"
            item["context"] = f"Instagram @{handle} public post mirror"
            item["score"] += 15
            output.append(item)
    return output


def instaloader_candidates(handle: str) -> list[dict]:
    if instaloader is None:
        return []
    output = []
    try:
        loader = instaloader.Instaloader(
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False,
            quiet=True,
        )
        profile = instaloader.Profile.from_username(loader.context, handle)
        for index, post in enumerate(profile.get_posts()):
            post_page = f"https://www.instagram.com/p/{post.shortcode}/"
            if post.typename == "GraphSidecar":
                for node in post.get_sidecar_nodes():
                    if not node.is_video and node.display_url:
                        output.append({"url": node.display_url, "page": post_page, "context": f"Instagram @{handle} post", "origin": f"instagram:@{handle}", "score": 30})
            elif post.url:
                output.append({"url": post.url, "page": post_page, "context": f"Instagram @{handle} post", "origin": f"instagram:@{handle}", "score": 30})
            if len(output) >= 18 or index >= 14:
                break
    except Exception as exc:
        print(f"Instagram Instaloader failed for @{handle}: {exc}")
    return output


def collect_instagram_images(brand: dict, count: int = 8) -> list[tuple[Image.Image, dict]]:
    all_candidates = []
    for handle in brand["instagram"]:
        all_candidates.extend(instaloader_candidates(handle))
        all_candidates.extend(instagram_api_candidates(handle))
        all_candidates.extend(instagram_mirror_candidates(handle))
    unique = {}
    for item in all_candidates:
        if item["url"] not in unique or item["score"] > unique[item["url"]]["score"]:
            unique[item["url"]] = item
    ranked = sorted(unique.values(), key=lambda x: x["score"], reverse=True)

    selected: list[tuple[Image.Image, dict]] = []
    hashes = []
    for item in ranked:
        downloaded = download_product_image(item, item.get("page"))
        if not downloaded:
            continue
        im, meta = downloaded
        current_hash = image_hash(im)
        if any(hamming(current_hash, previous) < 38 for previous in hashes):
            continue
        hashes.append(current_hash)
        selected.append((im, meta))
        if len(selected) >= count:
            break
    if len(selected) < 3:
        raise RuntimeError(f"Not enough Instagram product photos found for EVID: {len(selected)}")
    while len(selected) < count:
        original = selected[len(selected) % len(selected)]
        selected.append((original[0].copy(), dict(original[1], repeated=True)))
    return selected[:count]


def collect_brand_images(brand: dict, count: int = 8):
    if brand.get("instagram"):
        return collect_instagram_images(brand, count)
    return collect_website_images(brand, count)


def footer(page: Image.Image, number: int):
    draw = ImageDraw.Draw(page)
    y = H - 82
    draw.line((M, y, W - M, y), fill=LINE, width=2)
    draw.text((M, y + 18), "2026 TOKYO K-FASHION / BUYER GUIDE", font=f(18, True), fill=MUTED)
    text = f"{number:02d}"
    width = draw.textbbox((0, 0), text, font=f(18, True))[2]
    draw.text((W - M - width, y + 18), text, font=f(18, True), fill=MUTED)


def image_tile(page: Image.Image, im: Image.Image, box: tuple[int, int, int, int], accent=None):
    x0, y0, x1, y1 = box
    draw = ImageDraw.Draw(page)
    rounded(draw, box, 12, WHITE, accent or LINE, 2)
    tile = contain(im, (x1 - x0 - 8, y1 - y0 - 8), padding=20, bg=WHITE)
    page.paste(tile, (x0 + 4, y0 + 4))


def cover_page(all_images):
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    draw.text((M, 95), "BUYER & DISTRIBUTION PARTNER GUIDE", font=f(24, True), fill=MUTED)
    draw.text((M, 185), "2026 TOKYO", font=f(96, True), fill=INK)
    draw.text((M, 290), "K-FASHION", font=f(96, True), fill=INK)
    draw.text((M, 415), "POP-UP SHOWROOM & BUSINESS MATCHING", font=f(35, True), fill=INK)
    draw.rectangle((M, 495, M + 290, 507), fill=INK)
    meta = [("2026.10.08 THU", "11:00–19:00"), ("2026.10.09 FRI", "09:00–19:00"), ("OMOTESANDO", "KOH’S LICK CURRO 2F")]
    x = M
    for title, sub in meta:
        draw.text((x, 545), title, font=f(23, True), fill=INK)
        draw.text((x, 583), sub, font=f(20), fill=MUTED)
        x += 410
    gx, gy, gap = M, 680, 12
    tile_w = (W - 2 * M - gap * 4) // 5
    tile_h = 390
    for index, brand in enumerate(BRANDS):
        row, col = divmod(index, 5)
        x0 = gx + col * (tile_w + gap)
        y0 = gy + row * (tile_h + gap)
        image_tile(page, all_images[brand["name"]][0][0], (x0, y0, x0 + tile_w, y0 + tile_h), brand["accent"])
        draw.rectangle((x0 + 4, y0 + tile_h - 65, x0 + tile_w - 4, y0 + tile_h - 4), fill="#F8F6F1")
        draw.text((x0 + 13, y0 + tile_h - 50), brand["name"], font=f(16, True), fill=INK)
    draw.text((M, 1525), "日本のバイヤー・流通関係者向け 出展ブランドガイド", font=f(34, True), fill=INK)
    draw.text((M, 1590), "韓国・釜山発のファッションブランド10社を、東京・表参道でご紹介します。", font=f(25), fill=MUTED)
    rounded(draw, (M, 1685, W - M, 2105), 28, WHITE, LINE, 2)
    draw.text((M + 42, 1735), "EVENT", font=f(23, True), fill=MUTED)
    draw.text((M + 42, 1790), "2026 Tokyo K-Fashion Pop-up Showroom & Business Matching", font=f(31, True), fill=INK)
    draw.text((M + 42, 1860), "会場  Omotesando KOH’S LICK CURRO 2F  /  東京都渋谷区神宮前5-7-13", font=f(24), fill=INK)
    draw.text((M + 42, 1920), "商品展示・B2B商談・ブランド紹介・ネットワーキング・一部サンプル購入", font=f(24), fill=INK)
    draw.text((M + 42, 1980), "入場無料 / 事前申込・選定制 / 日本語通訳対応", font=f(24, True), fill=INK)
    footer(page, 1)
    return page


def overview_page(all_images):
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    draw.text((M, 90), "EVENT OVERVIEW", font=f(22, True), fill=MUTED)
    draw.text((M, 145), "日本のバイヤー・流通関係者の皆様へ", font=f(55, True), fill=INK)
    wrapped(draw, "韓国・釜山地域のファッション企業10社が東京・表参道に集結。商品を実際にご覧いただき、ブランド担当者との商談や今後の取引可能性をご検討いただける2日間です。", (M, 235), W - 2 * M, f(27), INK, 15, 3)
    rounded(draw, (M, 410, 750, 1540), 24, WHITE, LINE, 2)
    rows = [
        ("開催日", "2026年10月8日（木）11:00–19:00\n2026年10月9日（金）09:00–19:00"),
        ("会場", "Omotesando KOH’S LICK CURRO 2F\n東京都渋谷区神宮前5-7-13"),
        ("内容", "商品展示 / B2B商談 / ブランド紹介\nネットワーキング / 一部サンプル購入"),
        ("対応", "会場内で日本語通訳対応\n関心カテゴリーに応じたブランド紹介"),
        ("参加費", "無料（事前申込・選定制）"),
    ]
    y = 455
    for label, value in rows:
        draw.text((M + 35, y), label, font=f(20, True), fill=MUTED)
        yy = y + 42
        for line in value.split("\n"):
            draw.text((M + 35, yy), line, font=f(24, True), fill=INK)
            yy += 42
        y += 205 if "\n" in value else 145
        if y < 1500:
            draw.line((M + 30, y - 40, 720, y - 40), fill=LINE, width=2)
    rx, ry, gap = 790, 410, 14
    tw = (W - M - rx - gap) // 2
    th = 365
    for index, brand in enumerate(BRANDS[:6]):
        row, col = divmod(index, 2)
        x0 = rx + col * (tw + gap)
        y0 = ry + row * (th + gap)
        image_tile(page, all_images[brand["name"]][1][0], (x0, y0, x0 + tw, y0 + th), brand["accent"])
    by = 1630
    stats = [("10", "韓国ファッション\n参加ブランド"), ("1:1", "ブランド担当者との\nB2B商談"), ("¥18,000", "選定バイヤー1社1名\n交通費補助"), ("10/1", "参加申込締切\n名刺提出必須")]
    draw.line((M, by - 25, W - M, by - 25), fill=INK, width=3)
    draw.line((M, by + 250, W - M, by + 250), fill=INK, width=3)
    cell_w = (W - 2 * M) // 4
    for index, (large, small) in enumerate(stats):
        x0 = M + index * cell_w
        if index:
            draw.line((x0, by, x0, by + 225), fill=LINE, width=2)
        draw.text((x0 + 20, by + 28), large, font=f(46, True), fill=INK)
        yy = by + 105
        for line in small.split("\n"):
            draw.text((x0 + 20, yy), line, font=f(22, True), fill=INK)
            yy += 37
    draw.text((M, 1975), "主催：釜山地方中小ベンチャー企業庁", font=f(20, True), fill=INK)
    draw.text((M, 2015), "主管：釜山繊維ファッション産業連合会", font=f(20, True), fill=INK)
    draw.text((M, 2055), "バイヤー招待窓口：Linkon", font=f(20, True), fill=INK)
    footer(page, 2)
    return page


def brand_page(brand, records, number):
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    draw.rectangle((0, 0, W, 18), fill=brand["accent"])
    draw.text((M, 85), f"{brand['no']} / BRAND & ITEMS", font=f(21, True), fill=MUTED)
    draw.text((M, 145), brand["name"], font=f(58, True), fill=INK)
    draw.text((M, 225), brand["category"], font=f(31, True), fill=INK)
    draw.text((M, 275), f"COMPANY / {brand['company']}", font=f(19, True), fill=MUTED)

    gx, gy, gap = M, 345, 14
    tw = (W - 2 * M - gap * 2) // 3
    th = 360
    for index in range(6):
        row, col = divmod(index, 3)
        x0 = gx + col * (tw + gap)
        y0 = gy + row * (th + gap)
        image_tile(page, records[index][0], (x0, y0, x0 + tw, y0 + th), brand["accent"])

    y = 1135
    draw.line((M, y, W - M, y), fill=INK, width=4)
    y += 40
    wrapped(draw, brand["concept"], (M, y), W - 2 * M, f(29, True), INK, 15, 3)
    y += 135
    col_gap = 65
    col_w = (W - 2 * M - col_gap) // 2
    draw.text((M, y), "主なアイテム", font=f(19, True), fill=MUTED)
    wrapped(draw, brand["items"], (M, y + 42), col_w, f(23), INK, 12, 4)
    x2 = M + col_w + col_gap
    draw.text((x2, y), "想定バイヤー", font=f(19, True), fill=MUTED)
    wrapped(draw, brand["buyers"], (x2, y + 42), col_w, f(23), INK, 12, 4)

    y2 = 1630
    accent_rgb = tuple(int(brand["accent"][i:i + 2], 16) for i in (1, 3, 5))
    pale = tuple(int(value * 0.18 + 255 * 0.82) for value in accent_rgb)
    rounded(draw, (M, y2, W - M, y2 + 235), 24, pale, brand["accent"], 2)
    draw.text((M + 30, y2 + 28), "取引情報", font=f(22, True), fill=INK)
    wrapped(draw, "卸価格・MOQ・納期・日本展開条件等は、会場での商談時に個別にご案内します。関心商品や希望条件がある場合は、参加申込時にお知らせください。", (M + 30, y2 + 75), W - 2 * M - 60, f(22), INK, 12, 4)
    rounded(draw, (M, 1900, W - M, 2075), 22, WHITE, LINE, 2)
    source_label = "IMAGE SOURCE / Instagram official accounts" if brand.get("instagram") else "IMAGE SOURCE / Official brand website product photos"
    draw.text((M + 30, 1930), source_label, font=f(17, True), fill=MUTED)
    draw.text((M + 30, 1975), brand["display"], font=f(25, True), fill=INK)
    draw.text((M + 30, 2023), "All product photos are placed in full without cropping.", font=f(17), fill=MUTED)
    footer(page, number)
    return page


def application_page():
    page = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(page)
    draw.text((M, 90), "BUYER APPLICATION", font=f(22, True), fill=MUTED)
    draw.text((M, 145), "バイヤー参加申込・交通費補助", font=f(55, True), fill=INK)
    steps = [
        ("01", "招待メールに返信", "2026年10月1日（木）までにお申し込みください。"),
        ("02", "名刺データを添付", "会社名・部署・役職・氏名を確認できる名刺画像またはPDFをお送りください。"),
        ("03", "Linkonによる確認・選定", "所属企業、業態、役職等を確認し、参加確定者へ個別にメールでご案内します。"),
        ("04", "イベント当日にご来場", "参加確定メールを受けたご本人が会場へお越しください。"),
    ]
    sx, sy, sw, sh = M, 275, 990, 205
    for index, (num, title, description) in enumerate(steps):
        y = sy + index * (sh + 20)
        rounded(draw, (sx, y, sx + sw, y + sh), 22, WHITE, LINE, 2)
        draw.text((sx + 28, y + 35), num, font=f(42, True), fill=INK)
        draw.text((sx + 135, y + 32), title, font=f(28, True), fill=INK)
        wrapped(draw, description, (sx + 135, y + 86), sw - 175, f(22), MUTED, 10, 3)

    subject = quote("2026 Tokyo K-Fashion Buyer Application")
    body = quote("会社名：\n部署・役職：\n氏名：\n来場希望日・時間：\n関心カテゴリー：\n名刺データを添付します。")
    qr = qrcode.QRCode(box_size=12, border=2)
    qr.add_data(f"mailto:linkon@linkonkr.com?subject={subject}&body={body}")
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    qx, qy = 1135, 275
    rounded(draw, (qx, qy, W - M, qy + 880), 22, WHITE, INK, 3)
    page.paste(contain(qr_image, (350, 350), 0), (qx + 50, qy + 70))
    draw.text((qx + 120, qy + 445), "メール申込", font=f(30, True), fill=INK)
    wrapped(draw, "QRコードを読み取り、必要事項を入力して名刺データを添付してください。", (qx + 45, qy + 510), W - M - qx - 90, f(21), MUTED, 11, 6)

    y = 1240
    rounded(draw, (M, y, W - M, y + 520), 26, INK)
    draw.text((M + 35, y + 40), "¥18,000", font=f(68, True), fill=WHITE)
    draw.text((M + 410, y + 55), "選定されたバイヤー企業への交通費補助", font=f(31, True), fill=WHITE)
    bullets = [
        "バイヤー企業1社につき、来場者1名を対象に会場で日本円の現金をお渡しします。",
        "同一企業から複数名でご来場の場合も、支給対象は1名のみです。",
        "商談・商品の購入は必須ではありません。",
        "受領後の使途は自由で、会場内の一部出展商品のサンプル購入にもご利用いただけます。",
        "勤務先の社内規程により現金を受領できない場合があります。事前にご確認ください。",
    ]
    yy = y + 150
    for bullet in bullets:
        draw.ellipse((M + 420, yy + 8, M + 434, yy + 22), fill=WHITE)
        yy = wrapped(draw, bullet, (M + 455, yy), W - M - (M + 455), f(22), WHITE, 10, 2) + 12

    cy = 1815
    draw.line((M, cy, W - M, cy), fill=INK, width=4)
    draw.text((M, cy + 35), "BUYER INVITATION CONTACT", font=f(20, True), fill=MUTED)
    draw.text((M, cy + 80), "Linkon", font=f(44, True), fill=INK)
    draw.text((M, cy + 142), "代表  キム・ビョンス", font=f(23, True), fill=INK)
    draw.text((820, cy + 55), "E-mail", font=f(20, True), fill=MUTED)
    draw.text((960, cy + 55), "linkon@linkonkr.com", font=f(24, True), fill=INK)
    draw.text((820, cy + 103), "Tel.", font=f(20, True), fill=MUTED)
    draw.text((960, cy + 103), "+82 10 4760 5789", font=f(24, True), fill=INK)
    draw.text((820, cy + 151), "Web", font=f(20, True), fill=MUTED)
    draw.text((960, cy + 151), "pre.linkon.com", font=f(24, True), fill=INK)
    wrapped(draw, "ご送付いただいた名刺情報は、本イベントの参加確認、選定結果のご連絡および当日の本人確認の目的にのみ使用します。会場での展示・販売商品、在庫、価格は変更される場合があります。", (M, 2105), W - 2 * M, f(17), MUTED, 8, 4)
    footer(page, 13)
    return page


def contact_sheet(pages: list[Image.Image]):
    thumb_w, thumb_h = 260, 368
    cols = 4
    rows = (len(pages) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * 18, rows * thumb_h + (rows + 1) * 28), "#D9D6CF")
    draw = ImageDraw.Draw(sheet)
    for index, page in enumerate(pages):
        row, col = divmod(index, cols)
        x = 18 + col * (thumb_w + 18)
        y = 20 + row * (thumb_h + 28)
        thumb = crop_preview(page, (thumb_w, thumb_h))
        sheet.paste(thumb, (x, y))
        draw.text((x, y + thumb_h + 4), f"PAGE {index + 1:02d}", font=f(14, True), fill=INK)
    return sheet


def main():
    all_images = {}
    report = {"policy": "Direct product photos only; no website screenshots; images are contained without cropping.", "brands": {}}
    for brand in BRANDS:
        print(f"Collecting product photos for {brand['name']}...", flush=True)
        records = collect_brand_images(brand, 8)
        all_images[brand["name"]] = records
        report["brands"][brand["name"]] = [meta for _, meta in records]
        print(f"  selected {len(records)} photos", flush=True)

    pages = [cover_page(all_images), overview_page(all_images)]
    for page_number, brand in enumerate(BRANDS, start=3):
        pages.append(brand_page(brand, all_images[brand["name"]], page_number))
    pages.append(application_page())

    pages[0].save(PDF_PATH, save_all=True, append_images=pages[1:], resolution=150.0, quality=92, optimize=True)
    pages[0].resize((827, 1169), Image.Resampling.LANCZOS).save(PREVIEW_PATH, "PNG", optimize=True)
    contact_sheet(pages).save(CONTACT_PATH, "JPEG", quality=88, optimize=True)
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Created {PDF_PATH} ({PDF_PATH.stat().st_size:,} bytes)", flush=True)


if __name__ == "__main__":
    main()
