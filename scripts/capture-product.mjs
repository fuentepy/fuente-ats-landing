// Solo captura local. Requiere un checkout del ATS con sus dependencias instaladas.
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { realpath, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const landing = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.FUENTE_ATS_SOURCE) throw new Error('Indicá FUENTE_ATS_SOURCE: ruta al checkout local de fuente-ats.');
const ats = resolve(process.env.FUENTE_ATS_SOURCE);
const fixture = resolve(landing, 'scripts/product-capture');
const mocks = resolve(fixture, 'mocks.ts');
const { createServer } = await import(pathToFileURL(resolve(ats, 'node_modules/vite/dist/node/index.js')).href);
// Tailwind del ATS resuelve sus rutas de contenido desde el checkout del producto.
process.chdir(ats);
const aliases = ['@/hooks/useApplications', '@/hooks/usePipelineStages', '@/hooks/useJobs', '@/hooks/useClients', '@/hooks/useAuth', '@/hooks/useStageHistory', '@/lib/prefetchCandidate', '@/lib/routePrefetch'].map(find => ({ find, replacement: mocks }));
aliases.push({ find: '@ats-styles', replacement: resolve(ats, 'src/index.css') });
for (const name of ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']) aliases.push({ find: name, replacement: resolve(ats, 'node_modules', name) });
aliases.push({ find: '@', replacement: resolve(ats, 'src') });
const server = await createServer({
  configFile: false, root: fixture, envDir: false,
  resolve: { alias: aliases }, css: { postcss: ats },
  server: { host: '127.0.0.1', port: 4186, strictPort: true,
    fs: { allow: [fixture, ats, await realpath(resolve(ats, 'node_modules'))] } },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
  const output = resolve(landing, 'public/producto'); await mkdir(output, { recursive: true });
  for (const [name, width, height] of [['escritorio', 1440, 840], ['movil', 390, 900]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4186' ? route.continue() : route.abort());
    await page.goto('http://127.0.0.1:4186');
    await page.getByRole('heading', { name: 'Postulaciones', exact: true }).waitFor();
    await page.getByText('Camila Rojas', { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    // El scroll del kanban pertenece al componente real, no al viewport.
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: resolve(output, `postulaciones-${name}.png`), animations: 'disabled' });
    console.log(`Captura real del componente Postulaciones: ${width}px, datos sintéticos, sin red externa.`);
    await page.close();
  }
} finally { if (browser) await browser.close(); await server.close(); }
