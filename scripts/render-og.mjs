import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL('./og-template.html', import.meta.url).href);
  await page.locator('img').evaluate(img => img.decode());
  await page.screenshot({ path: fileURLToPath(new URL('../public/og-image.jpg', import.meta.url)), type: 'jpeg', quality: 90 });
} finally { await browser.close(); }
