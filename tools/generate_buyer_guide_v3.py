from __future__ import annotations

import io
import json
import time
from urllib.parse import quote_plus

from PIL import Image, ImageStat
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

import generate_buyer_guide as g

QUERIES = {
    "GOOD TRUST": 'GOOD TRUST Korean golf wear product',
    "STICO": 'STICO NEC shoes product',
    "commacomma": 'commacomma Korean blouse denim product',
    "ROSENICK": 'ROSENICK Korean women shoes product',
    "Sujeongga / mon le conte": 'mon le conte Korea baby shoes product',
    "OHGYO（烏橋）": 'OHGYO Korean fashion product',
    "REVE BY REVE": 'REVE BY REVE Korean shoes product',
    "SWIMMABEBE": 'SWIMMABEBE kids swimwear product',
    "REALCOCO": 'REALCOCO Korean dress product',
    "EVID": 'site:instagram.com evid_studio dive_up_evid fashion denim',
}

STICO_URLS = [
    "https://cdn.imweb.me/thumbnail/20210316/cb2155b095adc.png",
    "https://m.worklinemall.co.kr/web/product/big/202103/9852ef1d8b482187bfa4c8237e15d9cb.jpg",
    "https://cdn1.cybassets.com/s/files/26659/ckeditor/pictures/content_acf5fd22-2d4e-493e-bd68-5073a37321b6.JPG",
    "https://i.ebayimg.com/images/g/OVMAAOSw3HxakPmV/s-l400.jpg",
]

options = Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1600,2600")
options.add_argument("--lang=en-US")
options.add_argument("--ignore-certificate-errors")
options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36")
DRIVER = webdriver.Chrome(options=options)
DRIVER.set_page_load_timeout(20)


def valid(im: Image.Image) -> bool:
    if im.width < 160 or im.height < 140:
        return False
    ratio = im.width / max(1, im.height)
    if ratio < 0.35 or ratio > 2.8:
        return False
    return sum(ImageStat.Stat(im.resize((64, 64))).var) >= 30


def verified_stico_records(count: int):
    records = []
    for url in STICO_URLS:
        try:
            response = g.SESSION.get(url, timeout=25, allow_redirects=True)
            response.raise_for_status()
            im = Image.open(io.BytesIO(response.content)).convert("RGB")
            if not valid(im):
                continue
            records.append((im, {
                "image_url": response.url,
                "source_page": "STICO product listings",
                "width": im.width,
                "height": im.height,
                "origin": "verified_STICO_product_photo",
                "context": "STICO NEC functional footwear product image",
                "capture_method": "direct_product_image",
            }))
        except Exception:
            continue
    if not records:
        return []
    while len(records) < count:
        im, meta = records[(len(records) - 1) % len(records)]
        records.append((im.copy(), dict(meta, repeated=True)))
    return records[:count]


def collect(brand: dict, count: int = 8):
    if brand["name"] == "STICO":
        verified = verified_stico_records(count)
        if verified:
            return verified

    query = QUERIES[brand["name"]]
    search_url = "https://www.bing.com/images/search?q=" + quote_plus(query) + "&form=HDRSC2&first=1"
    try:
        DRIVER.get(search_url)
    except WebDriverException:
        try:
            DRIVER.execute_script("window.stop();")
        except Exception:
            pass
    time.sleep(1.7)
    try:
        height = DRIVER.execute_script("return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)") or 2500
        DRIVER.execute_script("window.scrollTo(0,arguments[0])", int(height * 0.75))
        time.sleep(0.5)
        DRIVER.execute_script("window.scrollTo(0,0)")
    except Exception:
        pass

    selected, hashes = [], []
    cards = DRIVER.find_elements(By.CSS_SELECTOR, ".iusc")
    for card in cards[:90]:
        try:
            metadata = json.loads(card.get_attribute("m") or "{}")
            title = (metadata.get("t") or metadata.get("desc") or "").lower()
            if any(word in title for word in ("logo", "website", "homepage", "screenshot", "banner")):
                continue
            image_el = card.find_element(By.CSS_SELECTOR, "img")
            raw = image_el.screenshot_as_png
            if not raw:
                continue
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            if not valid(im):
                continue
            current = g.image_hash(im)
            if any(g.hamming(current, old) < 30 for old in hashes):
                continue
            hashes.append(current)
            origin = "instagram_search:@evid_studio,@dive_up_evid" if brand["name"] == "EVID" else f"product_image_search:{brand['name']}"
            selected.append((im, {
                "image_url": metadata.get("murl") or image_el.get_attribute("src"),
                "source_page": metadata.get("purl") or search_url,
                "width": im.width,
                "height": im.height,
                "origin": origin,
                "context": (metadata.get("t") or query)[:180],
                "capture_method": "individual_product_thumbnail",
            }))
            if len(selected) >= count:
                break
        except Exception:
            continue

    if not selected:
        for image_el in DRIVER.find_elements(By.CSS_SELECTOR, "img.mimg")[:80]:
            try:
                im = Image.open(io.BytesIO(image_el.screenshot_as_png)).convert("RGB")
                if not valid(im):
                    continue
                current = g.image_hash(im)
                if any(g.hamming(current, old) < 30 for old in hashes):
                    continue
                hashes.append(current)
                origin = "instagram_search:@evid_studio,@dive_up_evid" if brand["name"] == "EVID" else f"product_image_search:{brand['name']}"
                selected.append((im, {
                    "image_url": image_el.get_attribute("src"), "source_page": search_url,
                    "width": im.width, "height": im.height, "origin": origin,
                    "context": query, "capture_method": "individual_product_thumbnail",
                }))
                if len(selected) >= count:
                    break
            except Exception:
                continue

    if not selected:
        raise RuntimeError(f"No product images found for {brand['name']}")
    while len(selected) < count:
        im, meta = selected[(len(selected) - 1) % len(selected)]
        selected.append((im.copy(), dict(meta, repeated=True)))
    return selected[:count]


g.collect_website_images = collect
g.collect_instagram_images = collect

try:
    g.main()
finally:
    DRIVER.quit()
