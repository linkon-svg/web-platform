from pathlib import Path
import json
import time
from PIL import Image, ImageDraw, ImageFont
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

OUT=Path('generated/goodtrust_debug')
OUT.mkdir(parents=True,exist_ok=True)
opts=Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')
opts.add_argument('--window-size=1600,3000')
opts.add_argument('--lang=en-US')
opts.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36')
d=webdriver.Chrome(options=opts)
d.set_page_load_timeout(50)
try:
    try:
        d.get('https://www.goodtrust.co.kr/company/product')
    except Exception:
        d.execute_script('window.stop();')
    time.sleep(5)
    for frac in (0.2,0.4,0.6,0.8,1.0):
        h=d.execute_script('return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)') or 3000
        d.execute_script('window.scrollTo(0,arguments[0])',int(h*frac)); time.sleep(1)
    h=d.execute_script('return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)') or 3000
    d.set_window_size(1600,min(int(h)+100,15000))
    d.execute_script('window.scrollTo(0,0)'); time.sleep(2)
    d.save_screenshot(str(OUT/'full_page.png'))
    records=[]
    imgs=d.find_elements(By.TAG_NAME,'img')
    for i,el in enumerate(imgs[:150]):
        try:
            src=el.get_attribute('currentSrc') or el.get_attribute('src') or ''
            alt=el.get_attribute('alt') or ''
            cls=el.get_attribute('class') or ''
            nw=int(d.execute_script('return arguments[0].naturalWidth||0',el) or 0)
            nh=int(d.execute_script('return arguments[0].naturalHeight||0',el) or 0)
            rect=el.rect
            rec={'i':i,'src':src,'alt':alt,'class':cls,'natural':[nw,nh],'rect':rect}
            records.append(rec)
            if rect.get('width',0)>=70 and rect.get('height',0)>=70:
                try: el.screenshot(str(OUT/f'img_{i:03d}.png'))
                except Exception as e: rec['screenshot_error']=str(e)
        except Exception as e:
            records.append({'i':i,'error':str(e)})
    bgs=d.execute_script('''const o=[]; for(const el of document.querySelectorAll('*')){const s=getComputedStyle(el); const b=s.backgroundImage; if(b&&b!=='none'&&b.includes('url(')){o.push({bg:b,cls:el.className||'',id:el.id||'',rect:el.getBoundingClientRect().toJSON()});} if(o.length>300)break;} return o;''')
    (OUT/'records.json').write_text(json.dumps({'url':d.current_url,'title':d.title,'height':h,'images':records,'backgrounds':bgs},ensure_ascii=False,indent=2),encoding='utf-8')
finally:
    d.quit()
