from __future__ import annotations

import io
from PIL import Image, ImageDraw
import generate_buyer_guide as guide


def quick_images(brand, count=9):
    images = []
    try:
        shot_url = f"https://image.thum.io/get/width/1500/crop/1250/noanimate/{brand['url']}"
        response = guide.SESSION.get(shot_url, timeout=20, allow_redirects=True)
        if response.ok and len(response.content) > 5000:
            shot = Image.open(io.BytesIO(response.content)).convert("RGB")
            cols, rows = 3, 2
            for row in range(rows):
                for col in range(cols):
                    x0 = int(col * shot.width / cols)
                    y0 = int(row * shot.height / rows)
                    x1 = int((col + 1) * shot.width / cols)
                    y1 = int((row + 1) * shot.height / rows)
                    images.append(shot.crop((x0, y0, x1, y1)))
    except Exception:
        images = []

    while len(images) < 6:
        canvas = Image.new("RGB", (900, 900), guide.BG)
        draw = ImageDraw.Draw(canvas)
        guide.rounded(draw, (55, 55, 845, 845), 44, fill=guide.WHITE, outline=brand["accent"], width=10)
        idx = len(images)
        for i in range(6):
            x = 105 + ((int(brand["no"]) * 83 + idx * 101 + i * 127) % 500)
            y = 100 + ((int(brand["no"]) * 47 + idx * 73 + i * 91) % 480)
            r = 48 + (i % 3) * 23
            draw.ellipse((x, y, x + 2*r, y + 2*r), fill=brand["accent"])
        draw.text((100, 710), brand["name"], font=guide.font(42, True), fill=guide.INK)
        images.append(canvas)
    return images[:6]


guide.download_brand_images = quick_images
guide.main()
