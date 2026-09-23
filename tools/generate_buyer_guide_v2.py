from __future__ import annotations

import io
import re
import time
from urllib.parse import urljoin, urlparse

from PIL import Image, ImageStat
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

import generate_buyer_guide as g


_DRIVER = None


def get_driver():
    global _DRIVER
    if _DRIVER is not None:
        return _DRIVER
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1600,3000")
    options.add_argument("--lang=ja-JP")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36")
    _DRIVER = webdriver.Chrome(options=options)
    _DRIVER.set_page_load_timeout(45)
    return _DRIVER


def clean_url(value: str | None, base: str) -> str | None:
    if not value or value.startswith("data:"):
        return None
    value = value.replace("&amp;", "&").strip()
    if value.startswith("//"):
        value = "https:" + value
    return urljoin(base, value)


def score_context(context: str) -> int:
    low = context.lower()
    if any(word in low for word in g.BANNED):
        return -100
    score = sum(3 for word in g.PRODUCT_HINTS if word in low)
    if any(word in low for word in ("model", "wear", "look", "style", "shoe", "dress", "shirt", "denim", "swim", "golf")):
        score += 5
    if any(word in low for word in ("product_no", "cate_no", "/product/", "/goods/", "/item/", "detail.html")):
        score += 8
    return score


def browser_page_candidates(page_url: str, origin: str = "official_website_browser"):
    driver = get_driver()
    try:
        driver.get(page_url)
    except WebDriverException:
        try:
            driver.execute_script("window.stop();")
        except Exception:
            pass
    time.sleep(3.5)
    for fraction in (0.2, 0.45, 0.7, 1.0):
        try:
            height = driver.execute_script("return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);") or 3000
            driver.execute_script("window.scrollTo(0, arguments[0]);", int(height * fraction))
            time.sleep(0.9)
        except Exception:
            break
    try:
        driver.execute_script("window.scrollTo(0, 0);")
    except Exception:
        pass

    output = []
    product_links = []
    try:
        for anchor in driver.find_elements(By.TAG_NAME, "a")[:500]:
            href = clean_url(anchor.get_attribute("href"), driver.current_url)
            if not href:
                continue
            low = href.lower()
            if any(token in low for token in ("product", "goods", "item", "detail", "shop")) and urlparse(href).netloc == urlparse(driver.current_url).netloc:
                if href not in product_links:
                    product_links.append(href)
    except Exception:
        pass

    elements = []
    try:
        elements = driver.find_elements(By.TAG_NAME, "img")
    except Exception:
        elements = []

    for element in elements[:500]:
        try:
            src = clean_url(element.get_attribute("currentSrc") or element.get_attribute("src"), driver.current_url)
            alt = element.get_attribute("alt") or ""
            klass = element.get_attribute("class") or ""
            element_id = element.get_attribute("id") or ""
            natural_w = int(driver.execute_script("return arguments[0].naturalWidth || 0;", element) or 0)
            natural_h = int(driver.execute_script("return arguments[0].naturalHeight || 0;", element) or 0)
            context = f"{src or ''} {alt} {klass} {element_id}"
            score = score_context(context)
            if score < 0 or natural_w < 250 or natural_h < 220:
                continue
            ratio = natural_w / max(1, natural_h)
            if ratio < 0.38 or ratio > 2.4:
                continue
            if min(natural_w, natural_h) >= 600:
                score += 4
            item = {
                "url": src,
                "page": driver.current_url,
                "context": context[:220],
                "origin": origin,
                "score": score,
                "natural_width": natural_w,
                "natural_height": natural_h,
            }
            try:
                png = element.screenshot_as_png
                if png and len(png) > 3500:
                    item["bytes"] = png
            except Exception:
                pass
            output.append(item)
        except Exception:
            continue

    try:
        backgrounds = driver.execute_script(
            """
            const out = [];
            for (const el of document.querySelectorAll('*')) {
              const bg = getComputedStyle(el).backgroundImage;
              if (bg && bg !== 'none' && bg.includes('url(')) {
                const m = bg.match(/url\\([\"']?(.*?)[\"']?\\)/);
                if (m) out.push({url:m[1], cls:el.className || '', id:el.id || ''});
              }
              if (out.length >= 150) break;
            }
            return out;
            """
        ) or []
        for item in backgrounds:
            src = clean_url(item.get("url"), driver.current_url)
            context = f"{src or ''} {item.get('cls','')} {item.get('id','')}"
            score = score_context(context)
            if src and score >= 0:
                output.append({"url": src, "page": driver.current_url, "context": context[:220], "origin": origin, "score": score})
    except Exception:
        pass

    unique = {}
    for item in output:
        key = item.get("url") or f"bytes:{hash(item.get('bytes', b''))}"
        if not key:
            continue
        if key not in unique or item.get("score", 0) > unique[key].get("score", 0):
            unique[key] = item
    return sorted(unique.values(), key=lambda x: x.get("score", 0), reverse=True), product_links[:8]


def image_from_candidate(item: dict, brand_url: str):
    downloaded = None
    if item.get("url"):
        downloaded = g.download_product_image(item, brand_url)
    if downloaded:
        return downloaded
    raw = item.get("bytes")
    if not raw:
        return None
    try:
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        if im.width < 180 or im.height < 160:
            return None
        ratio = im.width / max(1, im.height)
        if ratio < 0.35 or ratio > 2.5:
            return None
        if sum(ImageStat.Stat(im.resize((64, 64))).var) < 35:
            return None
        meta = {
            "image_url": item.get("url"),
            "source_page": item.get("page"),
            "width": im.width,
            "height": im.height,
            "origin": item.get("origin", "official_website_browser_element"),
            "context": item.get("context", "")[:180],
            "capture_method": "individual_image_element",
        }
        return im, meta
    except Exception:
        return None


def collect_records(candidates, brand_url, count=8):
    selected = []
    hashes = []
    for item in candidates:
        result = image_from_candidate(item, brand_url)
        if not result:
            continue
        im, meta = result
        current = g.image_hash(im)
        if any(g.hamming(current, previous) < 34 for previous in hashes):
            continue
        hashes.append(current)
        selected.append((im, meta))
        if len(selected) >= count:
            break
    return selected


def collect_website_images_browser(brand: dict, count: int = 8):
    candidates = []
    direct, links = g.page_image_candidates(brand["url"])
    for item in direct:
        item["origin"] = "official_website_direct_image"
        candidates.append(item)

    browser, browser_links = browser_page_candidates(brand["url"], "official_website_browser_image")
    candidates.extend(browser)
    links = list(dict.fromkeys(links + browser_links))

    selected = collect_records(sorted(candidates, key=lambda x: x.get("score", 0), reverse=True), brand["url"], count)
    if len(selected) < count:
        for product_page in links[:4]:
            more_direct, _ = g.page_image_candidates(product_page)
            for item in more_direct:
                item["origin"] = "official_product_page_direct_image"
                item["score"] = item.get("score", 0) + 8
            more_browser, _ = browser_page_candidates(product_page, "official_product_page_browser_image")
            candidates.extend(more_direct)
            candidates.extend(more_browser)
            selected = collect_records(sorted(candidates, key=lambda x: x.get("score", 0), reverse=True), brand["url"], count)
            if len(selected) >= count:
                break

    if not selected:
        raise RuntimeError(f"No product-only images could be captured for {brand['name']}")
    while len(selected) < count:
        source = selected[(len(selected) - 1) % len(selected)]
        selected.append((source[0].copy(), dict(source[1], repeated=True)))
    return selected[:count]


def collect_instagram_images_browser(brand: dict, count: int = 8):
    try:
        return g.collect_instagram_images(brand, count)
    except Exception as original_error:
        print(f"Primary Instagram collection failed: {original_error}")

    candidates = []
    for handle in brand["instagram"]:
        for mirror in (
            f"https://imginn.com/{handle}/",
            f"https://www.picuki.com/profile/{handle}",
            f"https://dumpor.io/v/{handle}",
            f"https://www.instagram.com/{handle}/",
        ):
            try:
                items, _ = browser_page_candidates(mirror, f"instagram_public_posts:@{handle}")
                for item in items:
                    item["score"] = item.get("score", 0) + 20
                candidates.extend(items)
            except Exception as exc:
                print(f"Instagram browser source failed {mirror}: {exc}")

    selected = collect_records(sorted(candidates, key=lambda x: x.get("score", 0), reverse=True), brand["url"], count)
    selected = [(im, dict(meta, origin=meta.get("origin", "instagram_public_posts"))) for im, meta in selected]
    if not selected:
        raise RuntimeError("No product photos could be captured from EVID Instagram accounts")
    while len(selected) < count:
        source = selected[(len(selected) - 1) % len(selected)]
        selected.append((source[0].copy(), dict(source[1], repeated=True)))
    return selected[:count]


g.collect_website_images = collect_website_images_browser
g.collect_instagram_images = collect_instagram_images_browser

try:
    g.main()
finally:
    if _DRIVER is not None:
        try:
            _DRIVER.quit()
        except Exception:
            pass
