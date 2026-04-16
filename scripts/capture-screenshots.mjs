import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('portfolio-screenshots');

const pages = [
  { name: 'home', url: 'http://localhost:3000' },
  { name: 'about', url: 'http://localhost:3000/introduce' },
  { name: 'space', url: 'http://localhost:3000/introduce/space' },
  { name: 'staff', url: 'http://localhost:3000/introduce/staff' },
  { name: 'schedule', url: 'http://localhost:3000/introduce/schedule' },
  { name: 'promotion', url: 'http://localhost:3000/exhibitions' },
];

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 },
];

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;
  let failCount = 0;
  const failures = [];

  for (const pageInfo of pages) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });

      try {
        console.log(`[${vp.label}] Loading ${pageInfo.name} (${pageInfo.url})...`);
        await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for CSS/fonts to load
        await new Promise((r) => setTimeout(r, 2000));

        // Viewport screenshot
        const vpFile = path.join(OUTPUT_DIR, `${vp.label}-${pageInfo.name}-viewport.png`);
        await page.screenshot({ path: vpFile, type: 'png' });
        console.log(`  -> ${path.basename(vpFile)}`);
        successCount++;

        // Full page screenshot
        const fullFile = path.join(OUTPUT_DIR, `${vp.label}-${pageInfo.name}-full.png`);
        await page.screenshot({ path: fullFile, type: 'png', fullPage: true });
        console.log(`  -> ${path.basename(fullFile)}`);
        successCount++;
      } catch (err) {
        console.error(`  [ERROR] Failed on ${vp.label}/${pageInfo.name}: ${err.message}`);
        failCount += 2;
        failures.push(`${vp.label}/${pageInfo.name}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  console.log('\n--- Summary ---');
  console.log(`Success: ${successCount} / ${successCount + failCount}`);
  if (failures.length > 0) {
    console.log(`Failed: ${failures.join(', ')}`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
