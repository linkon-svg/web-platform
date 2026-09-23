from __future__ import annotations

import io
import math
import os
import re
import textwrap
from pathlib import Path
from urllib.parse import quote, urljoin

import qrcode
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps, ImageStat

OUT_DIR = Path("tmp_pdf_output")
CACHE_DIR = Path("tmp_pdf_build/cache")
OUT_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)
OUT_PDF = OUT_DIR / "2026_Tokyo_KFashion_Buyer_Brand_Guide.pdf"

W, H = 1654, 2339  # A4 portrait, about 200 dpi
M = 110
BG = "#F4F1E9"
INK = "#1F1F1D"
MUTED = "#69645C"
LINE = "#CFC9BE"
WHITE = "#FFFFFF"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    "Accept-Language": "ja,en;q=0.8,ko;q=0.6",
})

BRANDS = [
    dict(no="01", name="GOOD TRUST", company="GOOD TRUST", category="ゴルフ・アクティブウェア",
         concept="ゴルフから日常まで、スポーツとライフスタイルをつなぐアパレルを提案します。",
         items="ポロシャツ、ハーフジップ、ベスト、パンツ、スカート、ワンピース、トレーニングウェア、軽量アウター",
         buyers="ゴルフ、スポーツ、アウトドア、デイリーウェアの専門店・卸・EC",
         url="https://www.goodtrust.co.kr/company/product", display="www.goodtrust.co.kr", accent="#AFC58F"),
    dict(no="02", name="STICO", company="NANOTECH CERAMICS CO., LTD.", category="機能性フットウェア",
         concept="用途に応じたクロッグ、スリッポン、ワークシューズ、ブーツなどを展開する機能性シューズブランドです。",
         items="NECシリーズ、ワークシューズ、クロッグ、レインブーツ、用途別機能性フットウェア",
         buyers="医療、外食、ワーク、アウトドア、シューズ専門流通",
         url="https://www.sticokorea.com/kr/portfolio-styles/", display="www.sticokorea.com", accent="#FF8B73"),
    dict(no="03", name="commacomma", company="commacomma", category="シャツ・ブラウス・デニム",
         concept="ディテールを活かしたシャツ、ブラウス、スウェット、デニムを展開する韓国ファッションブランドです。",
         items="ハートポイントブラウス、カラースウェット、シースルーブラウス、ワイドデニム、パンツ、スカート",
         buyers="レディースセレクトショップ、EC、コンセプトストア",
         url="https://www.commacomma.kr/shopinfo/company.html", display="commacomma.kr / @commacomma_kr", accent="#E9A8C6"),
    dict(no="04", name="ROSENICK", company="ROSENICK", category="レディースシューズ",
         concept="韓国国内生産のハンドメイドシューズを中心に、パンプス、ローファー、フラット、ブーツを展開します。",
         items="メリージェーン、厚底ローファー、リボンフラット、レースアップ、メッシュスニーカー、パディングブーツ",
         buyers="レディースシューズ、ファッション雑貨、百貨店・セレクトショップ",
         url="https://www.rosenick.co.kr/", display="www.rosenick.co.kr / @rosenick_official", accent="#E68FB6"),
    dict(no="05", name="Sujeongga / mon le conte", company="Sujeongga", category="ベビーシューズ・ライフスタイル雑貨",
         concept="ベビーのファーストシューズを中心に、育児雑貨やギフトアイテムを提案します。",
         items="Monbebe Toddle Shoes、ベビーソックスシューズ、おむつバッグ、育児雑貨、ギフトアイテム",
         buyers="ベビー・キッズ専門店、ギフト、百貨店キッズ、ライフスタイルショップ",
         url="https://monleconte.kr/", display="monleconte.kr", accent="#CDB67A"),
    dict(no="06", name="OHGYO（烏橋）", company="DALMAJI TIGER", category="メンズ・ウィメンズ・アクセサリー",
         concept="韓国の物語性と立体的なアヴァンギャルドデザインを融合するアート＆ファッションブランドです。",
         items="レイヤードドレス、アシンメトリーシャツ、ジャケット、サルエルパンツ、ネックレス、リング",
         buyers="デザイナーズセレクト、コンセプトストア、アート系リテール・メディア",
         url="https://en.ohgyo.com/", display="ohgyo.com / @ohgyo_official", accent="#A9BBD3"),
    dict(no="07", name="REVE BY REVE", company="PLOT CO., LTD.", category="レディースシューズ",
         concept="日常のコーディネートに上品さを添える、サンダル、パンプス、ローファー、スリングバックを提案します。",
         items="entrechat simple sandal、Ava Stiletto、Ronnie Loafer、Ribbon Satin Slingback",
         buyers="レディースシューズ、セレクトショップ、百貨店・EC",
         url="https://revebyreve.co.kr/", display="revebyreve.co.kr", accent="#B5A0C8"),
    dict(no="08", name="SWIMMABEBE", company="SMB Co., Ltd.", category="ベビー＆キッズスイムウェア",
         concept="ベビー・キッズ水着を中心に、ファミリーラインやリゾートウェアまで幅広く展開します。",
         items="ベビー水着、キッズ水着、ラッシュガード、セットアップ、ファミリーリゾートウェア",
         buyers="キッズ、スポーツ、リゾート、ライフスタイル専門流通",
         url="https://swimmabebe.com/", display="swimmabebe.com / @swim_ma_bebe", accent="#8CC7CE"),
    dict(no="09", name="REALCOCO", company="PBR Inc.", category="レディースファッション",
         concept="デイリーからオケージョンまで、ワンピースを中心に幅広い女性向けスタイルを提案します。",
         items="花柄ワンピース、シャツワンピース、シフォン、プリーツ、ミニマルドレス、ブラウス、ニット",
         buyers="レディースEC、セレクトショップ、百貨店オンライン、卸",
         url="https://realcoco.com/shopinfo/company.html", display="realcoco.com", accent="#D6A478"),
    dict(no="10", name="EVID", company="COOP. DESIGNALL", category="ストリートウェア・アップサイクル",
         concept="グラフィック、刺繍、アートワークを取り入れたカスタムウェアを制作するアートファッションスタジオです。",
         items="セットアップ、デニムパンツ、ジャケット、スカート、カスタムデニム、アートワークウェア",
         buyers="ストリート、アート、コンセプトストア、アップサイクル関連流通",
         url="https://www.instagram.com/evid_studio/", display="@evid_studio / @dive_up_evid", accent="#9BAE90"),
]


def find_font(bold=False):
    candidates = []
    if bold:
        candidates += [
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Bold.otf",
        ]
    candidates += [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return p
    raise FileNotFoundError("No usable font found")

FONT_REG = find_font(False)
FONT_BOLD = find_font(True)

def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size=size)


def rounded(draw, xy, radius=22, fill=WHITE, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def fit_image(im, size, crop=True, bg=WHITE):
    im = im.convert("RGB")
    if crop:
        return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))
    canvas = Image.new("RGB", size, bg)
    copy = im.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    canvas.paste(copy, ((size[0]-copy.width)//2, (size[1]-copy.height)//2))
    return canvas


def draw_wrapped(draw, text, xy, width_px, fnt, fill=INK, spacing=12, max_lines=None):
    words = list(text)
    lines, cur = [], ""
    for ch in words:
        test = cur + ch
        if draw.textbbox((0, 0), test, font=fnt)[2] <= width_px or not cur:
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
    line_h = fnt.size + spacing
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def candidate_image_urls(page_url):
    try:
        r = SESSION.get(page_url, timeout=30, allow_redirects=True)
        if not r.ok:
            return []
        soup = BeautifulSoup(r.text, "html.parser")
        urls = []
        for selector, attr in [
            (("meta", {"property": "og:image"}), "content"),
            (("meta", {"name": "twitter:image"}), "content"),
        ]:
            node = soup.find(*selector)
            if node and node.get(attr):
                urls.append(urljoin(r.url, node.get(attr)))
        for img in soup.find_all("img"):
            src = img.get("data-src") or img.get("data-original") or img.get("data-lazy") or img.get("ec-data-src") or img.get("src")
            if src and not src.startswith("data:"):
                urls.append(urljoin(r.url, src))
        out = []
        for u in urls:
            low = u.lower()
            if not u.startswith("http"):
                continue
            if any(k in low for k in ["logo", "icon", "favicon", "sprite", "arrow", "btn_", "loading"]):
                continue
            if u not in out:
                out.append(u)
        return out[:100]
    except Exception:
        return []


def valid_image(data):
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if im.width < 260 or im.height < 180:
            return None
        ratio = max(im.width, im.height) / max(1, min(im.width, im.height))
        if ratio > 5.0:
            return None
        small = im.resize((64, 64))
        if sum(ImageStat.Stat(small).var) < 45:
            return None
        return im
    except Exception:
        return None


def download_brand_images(brand, count=9):
    brand_dir = CACHE_DIR / re.sub(r"[^a-z0-9]+", "_", brand["name"].lower()).strip("_")
    brand_dir.mkdir(exist_ok=True)
    existing = sorted(brand_dir.glob("*.jpg"))
    if len(existing) >= count:
        return [Image.open(p).convert("RGB") for p in existing[:count]]
    images = []
    for u in candidate_image_urls(brand["url"]):
        if len(images) >= count:
            break
        try:
            rr = SESSION.get(u, timeout=25, allow_redirects=True)
            if not rr.ok or len(rr.content) < 2500:
                continue
            im = valid_image(rr.content)
            if im is None:
                continue
            # Reject near-duplicates using coarse average hash.
            thumb = ImageOps.fit(im, (32, 32)).convert("L")
            hsh = tuple(1 if p > 128 else 0 for p in thumb.getdata())
            if any(sum(a != b for a, b in zip(hsh, old[0])) < 60 for old in getattr(download_brand_images, "seen", [])):
                continue
            getattr(download_brand_images, "seen", []).append((hsh, brand["name"])) if hasattr(download_brand_images, "seen") else setattr(download_brand_images, "seen", [(hsh, brand["name"])])
            images.append(im)
        except Exception:
            continue
    # Fallback: website screenshot through thum.io, then crop into tiles.
    if len(images) < count:
        try:
            shot_url = f"https://image.thum.io/get/width/1600/crop/1400/noanimate/{brand['url']}"
            rr = SESSION.get(shot_url, timeout=75)
            shot = valid_image(rr.content) if rr.ok else None
            if shot:
                cols, rows = 3, 3
                for r in range(rows):
                    for c in range(cols):
                        if len(images) >= count:
                            break
                        x0 = int(c * shot.width / cols)
                        y0 = int(r * shot.height / rows)
                        x1 = int((c+1) * shot.width / cols)
                        y1 = int((r+1) * shot.height / rows)
                        images.append(shot.crop((x0, y0, x1, y1)))
        except Exception:
            pass
    # Final fallback: editorial placeholders based on brand accent.
    while len(images) < count:
        ph = Image.new("RGB", (720, 720), BG)
        d = ImageDraw.Draw(ph)
        acc = brand["accent"]
        rounded(d, (45, 45, 675, 675), 40, fill=WHITE, outline=acc, width=8)
        for i in range(5):
            x = 90 + ((int(brand["no"]) * 71 + len(images) * 97 + i * 109) % 430)
            y = 90 + ((int(brand["no"]) * 43 + len(images) * 61 + i * 83) % 390)
            r = 45 + (i % 3) * 22
            d.ellipse((x, y, x+r*2, y+r*2), fill=acc)
        d.text((90, 560), brand["name"], font=font(35, True), fill=INK)
        images.append(ph)
    for idx, im in enumerate(images[:count]):
        fit_image(im, (900, 900)).save(brand_dir / f"{idx:02d}.jpg", quality=88)
    return images[:count]


def add_footer(page, page_no):
    d = ImageDraw.Draw(page)
    y = H - 82
    d.line((M, y, W-M, y), fill=LINE, width=2)
    d.text((M, y+18), "2026 TOKYO K-FASHION / BUYER GUIDE", font=font(18, True), fill=MUTED)
    t = f"{page_no:02d}"
    tw = d.textbbox((0,0), t, font=font(18, True))[2]
    d.text((W-M-tw, y+18), t, font=font(18, True), fill=MUTED)


def cover_page(all_images):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.text((M, 95), "BUYER & DISTRIBUTION PARTNER GUIDE", font=font(24, True), fill=MUTED)
    d.text((M, 185), "2026 TOKYO", font=font(96, True), fill=INK)
    d.text((M, 290), "K-FASHION", font=font(96, True), fill=INK)
    d.text((M, 415), "POP-UP SHOWROOM & BUSINESS MATCHING", font=font(35, True), fill=INK)
    d.rectangle((M, 495, M+290, 507), fill=INK)
    meta = [
        ("2026.10.08 THU", "11:00–19:00"),
        ("2026.10.09 FRI", "09:00–19:00"),
        ("OMOTESANDO", "KOH’S LICK CURRO 2F"),
    ]
    x = M
    for title, sub in meta:
        d.text((x, 545), title, font=font(23, True), fill=INK)
        d.text((x, 583), sub, font=font(20), fill=MUTED)
        x += 410
    gx, gy = M, 680
    gap = 12
    tile_w = (W - 2*M - gap*4) // 5
    tile_h = 390
    for i, b in enumerate(BRANDS):
        row, col = divmod(i, 5)
        x0 = gx + col*(tile_w+gap)
        y0 = gy + row*(tile_h+gap)
        img = fit_image(all_images[b["name"]][0], (tile_w, tile_h))
        page.paste(img, (x0, y0))
        overlay = Image.new("RGBA", (tile_w, 70), (255,255,255,220))
        page.paste(overlay, (x0, y0+tile_h-70), overlay)
        d.text((x0+13, y0+tile_h-55), b["name"], font=font(17, True), fill=INK)
    d.text((M, 1525), "日本のバイヤー・流通関係者向け 出展ブランドガイド", font=font(34, True), fill=INK)
    d.text((M, 1590), "韓国・釜山発のファッションブランド10社を、東京・表参道でご紹介します。", font=font(25), fill=MUTED)
    rounded(d, (M, 1685, W-M, 2105), 28, fill=WHITE, outline=LINE, width=2)
    d.text((M+42, 1735), "EVENT", font=font(23, True), fill=MUTED)
    d.text((M+42, 1790), "2026 Tokyo K-Fashion Pop-up Showroom & Business Matching", font=font(31, True), fill=INK)
    d.text((M+42, 1860), "会場  Omotesando KOH’S LICK CURRO 2F  /  東京都渋谷区神宮前5-7-13", font=font(24), fill=INK)
    d.text((M+42, 1920), "商品展示・B2B商談・ブランド紹介・ネットワーキング・一部サンプル購入", font=font(24), fill=INK)
    d.text((M+42, 1980), "入場無料 / 事前申込・選定制 / 日本語通訳対応", font=font(24, True), fill=INK)
    add_footer(page, 1)
    return page


def overview_page(all_images):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.text((M, 90), "EVENT OVERVIEW", font=font(22, True), fill=MUTED)
    d.text((M, 145), "日本のバイヤー・流通関係者の皆様へ", font=font(55, True), fill=INK)
    draw_wrapped(d, "韓国・釜山地域のファッション企業10社が東京・表参道に集結。商品を実際にご覧いただき、ブランド担当者との商談や今後の取引可能性をご検討いただける2日間です。", (M, 235), W-2*M, font(27), fill=INK, spacing=15, max_lines=3)
    left = (M, 410, 750, 1540)
    rounded(d, left, 24, fill=WHITE, outline=LINE, width=2)
    rows = [
        ("開催日", "2026年10月8日（木）11:00–19:00\n2026年10月9日（金）09:00–19:00"),
        ("会場", "Omotesando KOH’S LICK CURRO 2F\n東京都渋谷区神宮前5-7-13"),
        ("内容", "商品展示 / B2B商談 / ブランド紹介\nネットワーキング / 一部サンプル購入"),
        ("対応", "会場内で日本語通訳対応\n関心カテゴリーに応じたブランド紹介"),
        ("参加費", "無料（事前申込・選定制）"),
    ]
    y = 455
    for label, val in rows:
        d.text((M+35, y), label, font=font(20, True), fill=MUTED)
        yy = y+42
        for line in val.split("\n"):
            d.text((M+35, yy), line, font=font(24, True), fill=INK)
            yy += 42
        y += 205 if "\n" in val else 145
        if y < 1500:
            d.line((M+30, y-40, 720, y-40), fill=LINE, width=2)
    rx, ry = 790, 410
    gap = 14
    tw = (W-M-rx-gap)//2
    th = 365
    for i, b in enumerate(BRANDS[:6]):
        r, c = divmod(i, 2)
        img = fit_image(all_images[b["name"]][1], (tw, th))
        page.paste(img, (rx+c*(tw+gap), ry+r*(th+gap)))
    by = 1630
    stats = [("10", "韓国ファッション\n参加ブランド"), ("1:1", "ブランド担当者との\nB2B商談"), ("¥18,000", "選定バイヤー1社1名\n交通費補助"), ("10/1", "参加申込締切\n名刺提出必須")]
    d.line((M, by-25, W-M, by-25), fill=INK, width=3)
    d.line((M, by+250, W-M, by+250), fill=INK, width=3)
    cell_w = (W-2*M)//4
    for i, (big, small) in enumerate(stats):
        x0 = M+i*cell_w
        if i:
            d.line((x0, by, x0, by+225), fill=LINE, width=2)
        d.text((x0+20, by+28), big, font=font(46, True), fill=INK)
        yy = by+105
        for line in small.split("\n"):
            d.text((x0+20, yy), line, font=font(22, True), fill=INK)
            yy += 37
    d.text((M, 1975), "主催：釜山地方中小ベンチャー企業庁", font=font(20, True), fill=INK)
    d.text((M, 2015), "主管：釜山繊維ファッション産業連合会", font=font(20, True), fill=INK)
    d.text((M, 2055), "バイヤー招待窓口：Linkon", font=font(20, True), fill=INK)
    add_footer(page, 2)
    return page


def brand_page(brand, imgs, page_no):
    page = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(page)
    d.rectangle((0,0,W,18), fill=brand["accent"])
    d.text((M, 85), f"{brand['no']} / BRAND & ITEMS", font=font(21, True), fill=MUTED)
    d.text((M, 145), brand["name"], font=font(60, True), fill=INK)
    d.text((M, 225), brand["category"], font=font(31, True), fill=INK)
    d.text((M, 275), f"COMPANY / {brand['company']}", font=font(19, True), fill=MUTED)
    gx, gy = M, 345
    gap = 14
    tw = (W-2*M-gap*2)//3
    th = 360
    for i in range(6):
        r, c = divmod(i,3)
        x0, y0 = gx+c*(tw+gap), gy+r*(th+gap)
        rounded(d, (x0,y0,x0+tw,y0+th), 10, fill=WHITE)
        page.paste(fit_image(imgs[i], (tw,th)), (x0,y0))
    y = 1135
    d.line((M, y, W-M, y), fill=INK, width=4)
    y += 40
    draw_wrapped(d, brand["concept"], (M,y), W-2*M, font(29, True), fill=INK, spacing=15, max_lines=3)
    y += 135
    col_gap = 65
    col_w = (W-2*M-col_gap)//2
    d.text((M,y), "主なアイテム", font=font(19, True), fill=MUTED)
    draw_wrapped(d, brand["items"], (M,y+42), col_w, font(23), fill=INK, spacing=12, max_lines=4)
    x2 = M+col_w+col_gap
    d.text((x2,y), "想定バイヤー", font=font(19, True), fill=MUTED)
    draw_wrapped(d, brand["buyers"], (x2,y+42), col_w, font(23), fill=INK, spacing=12, max_lines=4)
    y2 = 1630
    acc_rgb = tuple(int(brand["accent"][i:i+2],16) for i in (1,3,5))
    pale = tuple(int(v*0.18+255*0.82) for v in acc_rgb)
    rounded(d, (M,y2,W-M,y2+235), 24, fill=pale, outline=brand["accent"], width=2)
    d.text((M+30,y2+28), "取引情報", font=font(22, True), fill=INK)
    draw_wrapped(d, "卸価格・MOQ・納期・日本展開条件等は、会場での商談時に個別にご案内します。関心商品や希望条件がある場合は、参加申込時にお知らせください。", (M+30,y2+75), W-2*M-60, font(22), fill=INK, spacing=12, max_lines=4)
    rounded(d, (M,1900,W-M,2075), 22, fill=WHITE, outline=LINE, width=2)
    d.text((M+30,1935), "OFFICIAL", font=font(18, True), fill=MUTED)
    d.text((M+30,1980), brand["display"], font=font(25, True), fill=INK)
    add_footer(page, page_no)
    return page


def application_page(qr_img):
    page = Image.new("RGB", (W,H), BG)
    d = ImageDraw.Draw(page)
    d.text((M,90), "BUYER APPLICATION", font=font(22, True), fill=MUTED)
    d.text((M,145), "バイヤー参加申込・交通費補助", font=font(55, True), fill=INK)
    steps = [
        ("01", "招待メールに返信", "2026年10月1日（木）までにお申し込みください。"),
        ("02", "名刺データを添付", "会社名・部署・役職・氏名を確認できる名刺画像またはPDFをお送りください。"),
        ("03", "Linkonによる確認・選定", "所属企業、業態、役職等を確認し、参加確定者へ個別にメールでご案内します。"),
        ("04", "イベント当日にご来場", "参加確定メールを受けたご本人が会場へお越しください。"),
    ]
    sx, sy, sw, sh = M, 275, 990, 205
    for i,(num,title,desc) in enumerate(steps):
        y=sy+i*(sh+20)
        rounded(d,(sx,y,sx+sw,y+sh),22,fill=WHITE,outline=LINE,width=2)
        d.text((sx+28,y+35),num,font=font(42,True),fill=INK)
        d.text((sx+135,y+32),title,font=font(28,True),fill=INK)
        draw_wrapped(d,desc,(sx+135,y+86),sw-175,font(22),fill=MUTED,spacing=10,max_lines=3)
    qx,qy=1135,275
    rounded(d,(qx,qy,W-M,qy+880),22,fill=WHITE,outline=INK,width=3)
    qr = fit_image(qr_img,(350,350),crop=False,bg=WHITE)
    page.paste(qr,(qx+50,qy+70))
    d.text((qx+120,qy+445),"メール申込",font=font(30,True),fill=INK)
    draw_wrapped(d,"QRコードを読み取り、必要事項を入力して名刺データを添付してください。",(qx+45,qy+510),W-M-qx-90,font(21),fill=MUTED,spacing=11,max_lines=6)
    y=1240
    rounded(d,(M,y,W-M,y+520),26,fill=INK)
    d.text((M+35,y+40),"¥18,000",font=font(68,True),fill=WHITE)
    d.text((M+410,y+55),"選定されたバイヤー企業への交通費補助",font=font(31,True),fill=WHITE)
    bullets=[
        "バイヤー企業1社につき、来場者1名を対象に会場で日本円の現金をお渡しします。",
        "同一企業から複数名でご来場の場合も、支給対象は1名のみです。",
        "商談・商品の購入は必須ではありません。",
        "受領後の使途は自由で、会場内の一部出展商品のサンプル購入にもご利用いただけます。",
        "勤務先の社内規程により現金を受領できない場合があります。事前にご確認ください。",
    ]
    yy=y+150
    for b in bullets:
        d.ellipse((M+420,yy+8,M+434,yy+22),fill=WHITE)
        yy=draw_wrapped(d,b,(M+455,yy),W-M-(M+455),font(22),fill=WHITE,spacing=10,max_lines=2)+12
    cy=1815
    d.line((M,cy,W-M,cy),fill=INK,width=4)
    d.text((M,cy+35),"BUYER INVITATION CONTACT",font=font(20,True),fill=MUTED)
    d.text((M,cy+80),"Linkon",font=font(44,True),fill=INK)
    d.text((M,cy+142),"代表  キム・ビョンス",font=font(23,True),fill=INK)
    d.text((820,cy+55),"E-mail",font=font(20,True),fill=MUTED)
    d.text((960,cy+55),"linkon@linkonkr.com",font=font(24,True),fill=INK)
    d.text((820,cy+103),"Tel.",font=font(20,True),fill=MUTED)
    d.text((960,cy+103),"+82 10 4760 5789",font=font(24,True),fill=INK)
    d.text((820,cy+151),"Web",font=font(20,True),fill=MUTED)
    d.text((960,cy+151),"pre.linkon.com",font=font(24,True),fill=INK)
    draw_wrapped(d,"ご送付いただいた名刺情報は、本イベントの参加確認、選定結果のご連絡および当日の本人確認の目的にのみ使用します。掲載画像は提供資料および各社公開情報をもとに編集しています。展示・販売商品、在庫、価格は変更される場合があります。",(M,2105),W-2*M,font(17),fill=MUTED,spacing=8,max_lines=4)
    add_footer(page,13)
    return page


def main():
    all_images={}
    for b in BRANDS:
        print("collecting", b["name"], flush=True)
        all_images[b["name"]]=download_brand_images(b,9)
    qr=qrcode.QRCode(box_size=12,border=2)
    subject=quote("2026 Tokyo K-Fashion Buyer Application")
    body=quote("会社名：\n部署・役職：\n氏名：\n来場希望日・時間：\n関心カテゴリー：\n名刺データを添付します。")
    qr.add_data(f"mailto:linkon@linkonkr.com?subject={subject}&body={body}")
    qr.make(fit=True)
    qr_img=qr.make_image(fill_color="black",back_color="white").convert("RGB")
    pages=[cover_page(all_images),overview_page(all_images)]
    for i,b in enumerate(BRANDS,start=3):
        pages.append(brand_page(b,all_images[b["name"]],i))
    pages.append(application_page(qr_img))
    # PDF pages are intentionally rasterized to guarantee Japanese font fidelity in every viewer.
    pages_rgb=[p.convert("RGB") for p in pages]
    pages_rgb[0].save(OUT_PDF,save_all=True,append_images=pages_rgb[1:],resolution=150.0,quality=92,optimize=True)
    print(f"created {OUT_PDF} size={OUT_PDF.stat().st_size}",flush=True)

if __name__=="__main__":
    main()
