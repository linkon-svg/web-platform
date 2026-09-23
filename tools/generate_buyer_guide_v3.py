from __future__ import annotations

import io
import time
from pathlib import Path
from urllib.parse import quote_plus

from PIL import Image, ImageStat
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By

import generate_buyer_guide as g

# Load the browser helpers from v2, but stop before its collector assignment and main execution.
v2_path = Path(__file__).with_name("generate_buyer_guide_v2.py")
v2_source = v2_path.read_text(encoding="utf-8")
v2_source = v2_source.split("g.collect_website_images =", 1)[0]
ns: dict = {"__name__": "buyer_guide_browser_helpers", "__file__": str(v2_path)}
exec(compile(v2_source, str(v2_path), "exec"), ns)

get_driver = ns["get_driver"]
browser_page_candidates = ns["browser_page_candidates"]
collect_records = ns["collect_records"]
base_website_collector = ns["collect_website_images_browser"]
original_instagram_collector = g.collect_instagram_images


def displayed_image_record(element, page_url: str, origin: str):
    try:
        width = int(element.rect.get("width", 0))
        height = int(element.rect.get("height", 0))
        if width < 110 or height < 100:
            return None
        src = element.get_attribute("currentSrc") or element.get_attribute("src") or ""
        alt = element.get_attribute("alt") or ""
        png = element.screenshot_as_png
        if not png or len(png) < 2800:
            return None
        im = Image.open(io.BytesIO(png)).convert("RGB")
        if im.width < 100 or im.height < 90:
            return None
        ratio = im.width / max(1, im.height)
        if ratio < 0.35 or ratio > 2.8:
            return None
        if sum(ImageStat.Stat(im.resize((64, 64))).var) < 32:
            return None
        return im, {
            "image_url": src or None,
            "source_page": page_url,
            "width": im.width,
            "height": im.height,
            "origin": origin,
            "context": alt[:180],
            "capture_method": "individual_product_thumbnail",
        }
    except Exception:
        return None


def bing_product_images(query: str, origin: str, count: int = 8):
    driver = get_driver()
    url = "https://www.bing.com/images/search?q=" + quote_plus(query) + "&form=HDRSC2&first=1"
    try:
        driver.get(url)
    except WebDriverException:
        try:
            driver.execute_script("window.stop();")
        except Exception:
            pass
    time.sleep(2.2)
    for fraction in (0.35, 0.7, 1.0):
        try:
            height = driver.execute_script("return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);") or 2500
            driver.execute_script("window.scrollTo(0, arguments[0]);", int(height * fraction))
            time.sleep(0.55)
        except Exception:
            break
    elements = []
    for selector in ("img.mimg", "img[class*='mimg']", ".mimg", "img"):
        try:
            found = driver.find_elements(By.CSS_SELECTOR, selector)
            if found:
                elements = found
                break
        except Exception:
            continue
    selected = []
    hashes = []
    for element in elements[:100]:
        record = displayed_image_record(element, url, origin)
        if not record:
            continue
        im, meta = record
        current = g.image_hash(im)
        if any(g.hamming(current, previous) < 32 for previous in hashes):
            continue
        hashes.append(current)
        selected.append((im, meta))
        if len(selected) >= count:
            break
    if not selected:
        raise RuntimeError(f"No individual product thumbnails found for query: {query}")
    while len(selected) < count:
        im, meta = selected[(len(selected) - 1) % len(selected)]
        selected.append((im.copy(), dict(meta, repeated=True)))
    return selected[:count]


def website_collector(brand: dict, count: int = 8):
    try:
        records = base_website_collector(brand, count)
        if records:
            return records
    except Exception as exc:
        print(f"Official site image capture failed for {brand['name']}: {exc}", flush=True)
    query = f'"{brand["name"]}" {brand["category"]} product official'
    return bing_product_images(query, f"product_image_search:{brand['name']}", count)


def instagram_collector(brand: dict, count: int = 8):
    try:
        records = original_instagram_collector(brand, count)
        if records:
            return records
    except Exception as exc:
        print(f"Direct Instagram retrieval failed for EVID: {exc}", flush=True)
    handles = " ".join("@" + handle for handle in brand.get("instagram", []))
    query = f"{handles} EVID fashion denim Instagram"
    return bing_product_images(query, "instagram_product_search:@evid_studio,@dive_up_evid", count)


g.collect_website_images = website_collector
g.collect_instagram_images = instagram_collector

try:
    g.main()
finally:
    driver = ns.get("_DRIVER")
    if driver is not None:
        try:
            driver.quit()
        except Exception:
            pass
