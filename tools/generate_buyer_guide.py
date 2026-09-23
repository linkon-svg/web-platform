from __future__ import annotations

import io
import re
from pathlib import Path
from urllib.parse import quote, urljoin

import qrcode
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "generated"
CACHE = ROOT / ".buyer_guide_cache"
OUT.mkdir(exist_ok=True)
CACHE.mkdir(exist_ok=True)
PDF_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide.pdf"
PREVIEW_PATH = OUT / "2026_Tokyo_KFashion_Buyer_Brand_Guide_preview.png"

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
        "url": "https://www.commacomma.kr/shopinfo/company.html", "display": "commacomma.kr / @commacomma_kr",
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
        "url": "https://realcoco.com/shopinfo/company.html", "display": "realcoco.com",
    },
    {
        "no": "10", "name": "EVID", "company": "COOP. DESIGNALL",
        "category": "ストリートウェア・アップサイクル", "accent": "#9BAE90",
        "concept": "グラフィック、刺繍、アートワークを取り入れたカスタムウェアを制作するアートファッションスタジオです。",
        "items": "セットアップ、デニムパンツ、ジャケット、スカート、カスタムデニム、アートワークウェア",
        "buyers": "ストリート、アート、コンセプトストア、アップサイクル関連流通",
        "url": "https://www.instagram.com/evid_studio/", "display": "@evid_studio / @dive_up_evid",
    },
]


def font_path(bold=False):
    candidates = [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Bold.otf" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    raise FileNotFoundError("No usable CJK font found")

REG = font_path(False)
BOLD = font_path(True)

def f(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)


def rounded(draw, xy, radius=22, fill=WHITE, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def fit(im, size, crop=True, bg=WHITE):
    im = im.convert("RGB")
    if crop:
        return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))
    canvas = Image.new("RGB", size, bg)
    cp = im.copy()
    cp.thumbnail(size, Image.Resampling.LANCZOS)
    canvas.paste(cp, ((size[0]-cp.width)//2, (size[1]-cp.height)//2))
    return canvas


def wrapped(draw, text, xy, width, font, fill=INK, spacing=10, max_lines=None):
    lines, cur = [], ""
    for ch in text:
        test = cur + ch
        if not cur or draw.textbbox((0, 0), test, font=font)[2] <= width:
            cur = test
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1][:-1] + "…"
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + spacing
    return y


def candidates(page_url):
    try:
        r = SESSION.get(page_url, timeout=30, allow_redirects=True)
        if not r.ok:
            return []
        soup = BeautifulSoup(r.text, "html.parser")
        urls = []
        for attrs in ({"property": "og:image"}, {"name": "twitter:image"}):
            node = soup.find("meta", attrs=attrs)
            if node and node.get("content"):
                urls.append(urljoin(r.url, node["content"]))
        for img in soup.find_all("img"):
            src = img.get("data-src") or img.get("data-original") or img.get("data-lazy") or img.get("ec-data-src") or img.get("src")
            if src and not src.startswith("data:"):
                urls.append(urljoin(r.url, src))
        result = []
        for url in urls:
            low = url.lower()
            if not url.startswith("http"):
                continue
            if any(x in low for x in ["logo", "icon", "favicon", "sprite", "arrow", "btn_", "loading"]):
                continue
            if url not in result:
                result.append(url)
        return result[:120]
    except Exception:
        return []


def usable(data):
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if im.width < 250 or im.height < 180:
            return None
        if max(im.width, im.height) / max(1, min(im.width, im.height)) > 5:
            return None
        if sum(ImageStat.Stat(im.resize((64, 64))).var) < 45:
            return None
        return im
    except Exception:
        return None


def placeholder(brand, index):
    im = Image.new("RGB", (900, 900), BG)
    d = ImageDraw.Draw(im)
    rounded(d, (50, 50, 850, 850), 45, WHITE, brand["accent"], 10)
    for i in range(6):
        x = 90 + ((int(brand["no"]) * 67 + index * 97 + i * 127) % 540)
        y = 100 + ((int(brand["no"]) * 47 + index * 61 + i * 89) % 500)
        r = 45 + (i % 3) * 25
        d.ellipse((x, y, x+2*r, y+2*r), fill=brand["accent"])
    d.text((95, 700), brand["name"], font=f(40, True), fill=INK)
    return im


def brand_images(brand, count=8):
    folder = CACHE / re.sub(r"[^a-z0-9]+", "_", brand["name"].lower()).strip("_")
    folder.mkdir(exist_ok=True)
    cached = sorted(folder.glob("*.jpg"))
    if len(cached) >= count:
        return [Image.open(p).convert("RGB") for p in cached[:count]]
    images = []
    seen = []
    for url in candidates(brand["url"]):
        if len(images) >= count:
            break
        try:
            rr = SESSION.get(url, timeout=25, allow_redirects=True)
            if not rr.ok or len(rr.content) < 2500:
                continue
            im = usable(rr.content)
            if im is None:
                continue
            thumb = fit(im, (32, 32)).convert("L")
            sig = list(thumb.getdata())
            if any(sum(abs(a-b) for a, b in zip(sig, old)) < 6000 for old in seen):
                continue
            seen.append(sig)
            images.append(im)
        except Exception:
            continue
    if len(images) < count:
        for service in [
            f"https://image.thum.io/get/width/1600/crop/1400/noanimate/{brand['url']}",
            f"https://s.wordpress.com/mshots/v1/{quote(brand['url'], safe='')}?w=1600",
        ]:
            try:
                rr = SESSION.get(service, timeout=75)
                shot = usable(rr.content) if rr.ok else None
                if not shot:
                    continue
                for row in range(3):
                    for col in range(3):
                        if len(images) >= count:
                            break
                        x0 = int(col * shot.width / 3)
                        y0 = int(row * shot.height / 3)
                        x1 = int((col+1) * shot.width / 3)
                        y1 = int((row+1) * shot.height / 3)
                        images.append(shot.crop((x0, y0, x1, y1)))
                if len(images) >= count:
                    break
            except Exception:
                pass
    while len(images) < count:
        images.append(placeholder(brand, len(images)))
    output = []
    for i, im in enumerate(images[:count]):
        norm = fit(im, (900, 900))
        norm.save(folder / f"{i:02d}.jpg", quality=88)
        output.append(norm)
    return output


def footer(page, no):
    d = ImageDraw.Draw(page)
    y = H - 78
    d.line((M, y, W-M, y), fill=LINE, width=2)
    d.text((M, y+17), "2026 TOKYO K-FASHION / BUYER GUIDE", font=f(18, True), fill=MUTED)
    s = f"{no:02d}"
    tw = d.textbbox((0, 0), s, font=f(18, True))[2]
    d.text((W-M-tw, y+17), s, font=f(18, True), fill=MUTED)


def cover(images):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.text((M, 90), "BUYER & DISTRIBUTION PARTNER GUIDE", font=f(24, True), fill=MUTED)
    d.text((M, 180), "2026 TOKYO", font=f(96, True), fill=INK)
    d.text((M, 287), "K-FASHION", font=f(96, True), fill=INK)
    d.text((M, 415), "POP-UP SHOWROOM & BUSINESS MATCHING", font=f(35, True), fill=INK)
    d.rectangle((M, 495, M+290, 507), fill=INK)
    meta = [("2026.10.08 THU", "11:00–19:00"), ("2026.10.09 FRI", "09:00–19:00"), ("OMOTESANDO", "KOH’S LICK CURRO 2F")]
    x = M
    for title, sub in meta:
        d.text((x, 545), title, font=f(23, True), fill=INK)
        d.text((x, 583), sub, font=f(20), fill=MUTED)
        x += 410
    gap = 12
    tile_w = (W - 2*M - 4*gap)//5
    tile_h = 370
    gy = 680
    for i, brand in enumerate(BRANDS):
        r, c = divmod(i, 5)
        x0 = M + c*(tile_w+gap)
        y0 = gy + r*(tile_h+gap)
        page.paste(fit(images[brand["name"]][0], (tile_w, tile_h)), (x0, y0))
        overlay = Image.new("RGBA", (tile_w, 66), (255, 255, 255, 222))
        page.paste(overlay, (x0, y0+tile_h-66), overlay)
        d.text((x0+11, y0+tile_h-50), brand["name"], font=f(16, True), fill=INK)
    d.text((M, 1505), "日本のバイヤー・流通関係者向け 出展ブランドガイド", font=f(34, True), fill=INK)
    d.text((M, 1570), "韓国・釜山発のファッションブランド10社を、東京・表参道でご紹介します。", font=f(25), fill=MUTED)
    rounded(d, (M, 1660, W-M, 2085), 28, WHITE, LINE, 2)
    d.text((M+40, 1710), "EVENT", font=f(22, True), fill=MUTED)
    d.text((M+40, 1765), "2026 Tokyo K-Fashion Pop-up Showroom & Business Matching", font=f(31, True), fill=INK)
    d.text((M+40, 1840), "会場  Omotesando KOH’S LICK CURRO 2F  /  東京都渋谷区神宮前5-7-13", font=f(24), fill=INK)
    d.text((M+40, 1900), "商品展示・B2B商談・ブランド紹介・ネットワーキング・一部サンプル購入", font=f(24), fill=INK)
    d.text((M+40, 1960), "入場無料 / 事前申込・選定制 / 日本語通訳対応", font=f(24, True), fill=INK)
    footer(page, 1)
    return page


def overview(images):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.text((M, 90), "EVENT OVERVIEW", font=f(22, True), fill=MUTED)
    d.text((M, 145), "日本のバイヤー・流通関係者の皆様へ", font=f(55, True), fill=INK)
    wrapped(d, "韓国・釜山地域のファッション企業10社が東京・表参道に集結。商品を実際にご覧いただき、ブランド担当者との商談や今後の取引可能性をご検討いただける2日間です。", (M, 235), W-2*M, f(27), INK, 15, 3)
    rounded(d, (M, 405, 750, 1535), 24, WHITE, LINE, 2)
    rows = [
        ("開催日", ["2026年10月8日（木）11:00–19:00", "2026年10月9日（金）09:00–19:00"]),
        ("会場", ["Omotesando KOH’S LICK CURRO 2F", "東京都渋谷区神宮前5-7-13"]),
        ("内容", ["商品展示 / B2B商談 / ブランド紹介", "ネットワーキング / 一部サンプル購入"]),
        ("対応", ["会場内で日本語通訳対応", "関心カテゴリーに応じたブランド紹介"]),
        ("参加費", ["無料（事前申込・選定制）"]),
    ]
    y = 450
    for idx, (label, vals) in enumerate(rows):
        d.text((M+34, y), label, font=f(20, True), fill=MUTED)
        yy = y + 42
        for val in vals:
            d.text((M+34, yy), val, font=f(23, True), fill=INK)
            yy += 39
        y += 205 if len(vals) == 2 else 145
        if idx < len(rows)-1:
            d.line((M+30, y-38, 720, y-38), fill=LINE, width=2)
    rx, ry = 790, 405
    gap = 14
    tw = (W-M-rx-gap)//2
    th = 365
    for i, brand in enumerate(BRANDS[:6]):
        r, c = divmod(i, 2)
        page.paste(fit(images[brand["name"]][1], (tw, th)), (rx+c*(tw+gap), ry+r*(th+gap)))
    by = 1630
    stats = [("10", "韓国ファッション\n参加ブランド"), ("1:1", "ブランド担当者との\nB2B商談"), ("¥18,000", "選定バイヤー1社1名\n交通費補助"), ("10/1", "参加申込締切\n名刺提出必須")]
    d.line((M, by-25, W-M, by-25), fill=INK, width=3)
    d.line((M, by+250, W-M, by+250), fill=INK, width=3)
    cw = (W-2*M)//4
    for i, (big, small) in enumerate(stats):
        x0 = M+i*cw
        if i:
            d.line((x0, by, x0, by+225), fill=LINE, width=2)
        d.text((x0+18, by+28), big, font=f(44, True), fill=INK)
        yy = by+105
        for line in small.split("\n"):
            d.text((x0+18, yy), line, font=f(21, True), fill=INK)
            yy += 36
    d.text((M, 1975), "主催：釜山地方中小ベンチャー企業庁", font=f(20, True), fill=INK)
    d.text((M, 2015), "主管：釜山繊維ファッション産業連合会", font=f(20, True), fill=INK)
    d.text((M, 2055), "バイヤー招待窓口：Linkon", font=f(20, True), fill=INK)
    footer(page, 2)
    return page


def brand_page(brand, images, no):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.rectangle((0, 0, W, 18), fill=brand["accent"])
    d.text((M, 85), f"{brand['no']} / BRAND & ITEMS", font=f(21, True), fill=MUTED)
    d.text((M, 145), brand["name"], font=f(58, True), fill=INK)
    d.text((M, 225), brand["category"], font=f(31, True), fill=INK)
    d.text((M, 275), f"COMPANY / {brand['company']}", font=f(19, True), fill=MUTED)
    gap = 14
    tw = (W-2*M-2*gap)//3
    th = 360
    gy = 345
    for i in range(6):
        r, c = divmod(i, 3)
        x0, y0 = M+c*(tw+gap), gy+r*(th+gap)
        page.paste(fit(images[i], (tw, th)), (x0, y0))
    y = 1135
    d.line((M, y, W-M, y), fill=INK, width=4)
    wrapped(d, brand["concept"], (M, y+40), W-2*M, f(29, True), INK, 15, 3)
    y2 = 1310
    gap2 = 65
    colw = (W-2*M-gap2)//2
    d.text((M, y2), "主なアイテム", font=f(19, True), fill=MUTED)
    wrapped(d, brand["items"], (M, y2+42), colw, f(23), INK, 12, 4)
    x2 = M+colw+gap2
    d.text((x2, y2), "想定バイヤー", font=f(19, True), fill=MUTED)
    wrapped(d, brand["buyers"], (x2, y2+42), colw, f(23), INK, 12, 4)
    r, g, b = [int(brand["accent"][i:i+2], 16) for i in (1, 3, 5)]
    pale = tuple(int(v*0.18 + 255*0.82) for v in (r, g, b))
    rounded(d, (M, 1630, W-M, 1865), 24, pale, brand["accent"], 2)
    d.text((M+30, 1658), "取引情報", font=f(22, True), fill=INK)
    wrapped(d, "卸価格・MOQ・納期・日本展開条件等は、会場での商談時に個別にご案内します。関心商品や希望条件がある場合は、参加申込時にお知らせください。", (M+30, 1705), W-2*M-60, f(22), INK, 12, 4)
    rounded(d, (M, 1900, W-M, 2075), 22, WHITE, LINE, 2)
    d.text((M+30, 1935), "OFFICIAL", font=f(18, True), fill=MUTED)
    d.text((M+30, 1980), brand["display"], font=f(25, True), fill=INK)
    footer(page, no)
    return page


def application(qr_image):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.text((M, 90), "BUYER APPLICATION", font=f(22, True), fill=MUTED)
    d.text((M, 145), "バイヤー参加申込・交通費補助", font=f(55, True), fill=INK)
    steps = [
        ("01", "招待メールに返信", "2026年10月1日（木）までにお申し込みください。"),
        ("02", "名刺データを添付", "会社名・部署・役職・氏名を確認できる名刺画像またはPDFをお送りください。"),
        ("03", "Linkonによる確認・選定", "所属企業、業態、役職等を確認し、参加確定者へ個別にメールでご案内します。"),
        ("04", "イベント当日にご来場", "参加確定メールを受けたご本人が会場へお越しください。"),
    ]
    sx, sy, sw, sh = M, 275, 990, 205
    for i, (num, title, desc) in enumerate(steps):
        y = sy+i*(sh+20)
        rounded(d, (sx, y, sx+sw, y+sh), 22, WHITE, LINE, 2)
        d.text((sx+28, y+35), num, font=f(42, True), fill=INK)
        d.text((sx+135, y+32), title, font=f(28, True), fill=INK)
        wrapped(d, desc, (sx+135, y+86), sw-175, f(22), MUTED, 10, 3)
    qx, qy = 1135, 275
    rounded(d, (qx, qy, W-M, qy+880), 22, WHITE, INK, 3)
    page.paste(fit(qr_image, (350, 350), False), (qx+50, qy+70))
    d.text((qx+120, qy+445), "メール申込", font=f(30, True), fill=INK)
    wrapped(d, "QRコードを読み取り、必要事項を入力して名刺データを添付してください。", (qx+45, qy+510), W-M-qx-90, f(21), MUTED, 11, 6)
    y = 1240
    rounded(d, (M, y, W-M, y+520), 26, INK)
    d.text((M+35, y+40), "¥18,000", font=f(68, True), fill=WHITE)
    d.text((M+410, y+55), "選定されたバイヤー企業への交通費補助", font=f(31, True), fill=WHITE)
    bullets = [
        "バイヤー企業1社につき、来場者1名を対象に会場で日本円の現金をお渡しします。",
        "同一企業から複数名でご来場の場合も、支給対象は1名のみです。",
        "商談・商品の購入は必須ではありません。",
        "受領後の使途は自由で、会場内の一部出展商品のサンプル購入にもご利用いただけます。",
        "勤務先の社内規程により現金を受領できない場合があります。事前にご確認ください。",
    ]
    yy = y+150
    for item in bullets:
        d.ellipse((M+420, yy+8, M+434, yy+22), fill=WHITE)
        yy = wrapped(d, item, (M+455, yy), W-M-(M+455), f(22), WHITE, 10, 2)+12
    cy = 1815
    d.line((M, cy, W-M, cy), fill=INK, width=4)
    d.text((M, cy+35), "BUYER INVITATION CONTACT", font=f(20, True), fill=MUTED)
    d.text((M, cy+80), "Linkon", font=f(44, True), fill=INK)
    d.text((M, cy+142), "代表  キム・ビョンス", font=f(23, True), fill=INK)
    d.text((820, cy+55), "E-mail", font=f(20, True), fill=MUTED)
    d.text((960, cy+55), "linkon@linkonkr.com", font=f(24, True), fill=INK)
    d.text((820, cy+103), "Tel.", font=f(20, True), fill=MUTED)
    d.text((960, cy+103), "+82 10 4760 5789", font=f(24, True), fill=INK)
    d.text((820, cy+151), "Web", font=f(20, True), fill=MUTED)
    d.text((960, cy+151), "pre.linkon.com", font=f(24, True), fill=INK)
    wrapped(d, "ご送付いただいた名刺情報は、本イベントの参加確認、選定結果のご連絡および当日の本人確認の目的にのみ使用します。掲載画像は提供資料および各社公開情報をもとに編集しています。展示・販売商品、在庫、価格は変更される場合があります。", (M, 2105), W-2*M, f(17), MUTED, 8, 4)
    footer(page, 13)
    return page


def make_preview(pages):
    thumbs = [fit(p, (330, 467), False, BG) for p in pages]
    canvas = Image.new("RGB", (5*350+20, 3*487+20), "#D7D3CB")
    for i, thumb in enumerate(thumbs):
        r, c = divmod(i, 5)
        canvas.paste(thumb, (10+c*350, 10+r*487))
    canvas.save(PREVIEW_PATH, quality=90)


def main():
    all_images = {}
    for brand in BRANDS:
        print(f"Collecting images: {brand['name']}", flush=True)
        all_images[brand["name"]] = brand_images(brand, 8)
    qr = qrcode.QRCode(box_size=12, border=2)
    subject = quote("2026 Tokyo K-Fashion Buyer Application")
    body = quote("会社名：\n部署・役職：\n氏名：\n来場希望日・時間：\n関心カテゴリー：\n名刺データを添付します。")
    qr.add_data(f"mailto:linkon@linkonkr.com?subject={subject}&body={body}")
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    pages = [cover(all_images), overview(all_images)]
    for idx, brand in enumerate(BRANDS, start=3):
        pages.append(brand_page(brand, all_images[brand["name"]], idx))
    pages.append(application(qr_image))
    pages[0].save(PDF_PATH, save_all=True, append_images=pages[1:], resolution=150.0, quality=92, optimize=True)
    make_preview(pages)
    print(f"Created {PDF_PATH} ({PDF_PATH.stat().st_size} bytes)", flush=True)
    print(f"Created {PREVIEW_PATH} ({PREVIEW_PATH.stat().st_size} bytes)", flush=True)


if __name__ == "__main__":
    main()
