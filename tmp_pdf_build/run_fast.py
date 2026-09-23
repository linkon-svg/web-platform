from __future__ import annotations

import generate_buyer_guide as guide

_original_get = guide.SESSION.get
_original_candidates = guide.candidate_image_urls
_original_download = guide.download_brand_images


def fast_get(url, *args, **kwargs):
    timeout = kwargs.get("timeout", 8)
    try:
        timeout = min(float(timeout), 8.0)
    except Exception:
        timeout = 8.0
    kwargs["timeout"] = timeout
    return _original_get(url, *args, **kwargs)


def limited_candidates(page_url):
    return _original_candidates(page_url)[:20]


def six_images(brand, count=9):
    return _original_download(brand, count=6)


guide.SESSION.get = fast_get
guide.candidate_image_urls = limited_candidates
guide.download_brand_images = six_images

guide.main()
