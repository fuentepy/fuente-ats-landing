import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const template = await readFile(new URL('./og-template.html', import.meta.url), 'utf8');
  const logo = await readFile(new URL('../public/logo-fuentehr.png', import.meta.url));
  await page.setContent(template.replace('../public/logo-fuentehr.png', `data:image/png;base64,${logo.toString('base64')}`));
  await page.locator('img').evaluate(img => img.decode());
  await page.screenshot({ path: fileURLToPath(new URL('../public/og-image.jpg', import.meta.url)), type: 'jpeg', quality: 90 });
} finally { await browser.close(); }
