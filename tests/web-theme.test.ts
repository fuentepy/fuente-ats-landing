import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { applyWebTheme, WEB_THEME_KEY } from '../src/pages/ats-landing/useWebTheme';
const init = readFileSync('public/web-theme-init.js', 'utf8');
const themeCss = readFileSync('public/web-theme.css', 'utf8');
afterEach(() => vi.unstubAllGlobals());

function environment(saved?: string | null, blocked = false) {
  const attrs = new Map<string, string>();
  const root = { setAttribute: (key: string, value: string) => attrs.set(key, value), getAttribute: (key: string) => attrs.get(key) };
  const meta = { setAttribute: vi.fn() };
  const localStorage = {
    getItem: vi.fn(() => { if (blocked) throw new Error('Blocked'); return saved ?? null; }),
    setItem: vi.fn(() => { if (blocked) throw new Error('Blocked'); }),
  };
  return { attrs, root, meta, document: { documentElement: root, querySelector: () => meta }, localStorage,
    getComputedStyle: () => ({ backgroundColor: attrs.get('data-web-theme') === 'light' ? 'rgb(255, 255, 255)' : 'rgb(9, 17, 13)' }) };
}
describe('inicialización antes del bundle', () => {
  for (const [saved, expected] of [[undefined, 'dark'], ['dark', 'dark'], ['light', 'light'], ['invalid', 'dark']] as const) {
    it(`preferencia ${saved ?? 'ausente'}: ${expected}, sin guardar un valor por defecto`, () => {
      const env = environment(saved); runInNewContext(init, env);
      expect(env.attrs.get('data-web-theme')).toBe(expected);
      expect(env.localStorage.getItem).toHaveBeenCalledWith(WEB_THEME_KEY);
      expect(env.localStorage.setItem).not.toHaveBeenCalled();
      expect(env.meta.setAttribute).toHaveBeenCalled();
    });
  }
  it('el almacenamiento bloqueado no impide abrir la web', () => {
    const env = environment(null, true); expect(() => runInNewContext(init, env)).not.toThrow();
    expect(env.attrs.get('data-web-theme')).toBe('dark');
  });
});
it('el CSS y la inicialización se cargan antes del bundle sin debilitar CSP', () => {
  const html = readFileSync('index.html', 'utf8');
  expect(html.indexOf('/web-theme.css')).toBeLessThan(html.indexOf('/web-theme-init.js'));
  expect(html.indexOf('/web-theme-init.js')).toBeLessThan(html.indexOf('/src/main.tsx'));
  expect(themeCss).toContain('color-scheme: dark'); expect(themeCss).toContain('color-scheme: light');
  expect(readFileSync('vercel.json', 'utf8')).not.toContain('unsafe-inline');
});
it('el cambio explícito guarda solo la preferencia de la web, sin tocar la del ATS', () => {
  const env = environment();
  vi.stubGlobal('document', env.document); vi.stubGlobal('localStorage', env.localStorage); vi.stubGlobal('getComputedStyle', env.getComputedStyle);
  applyWebTheme('light', true);
  expect(env.attrs.get('data-web-theme')).toBe('light');
  expect(env.localStorage.setItem).toHaveBeenCalledExactlyOnceWith('fuentehr-web-theme', 'light');
  applyWebTheme('dark'); expect(env.localStorage.setItem).toHaveBeenCalledTimes(1);
});
it('el cambio funciona durante la visita aunque no se pueda persistir', () => {
  const env = environment(null, true);
  vi.stubGlobal('document', env.document); vi.stubGlobal('localStorage', env.localStorage); vi.stubGlobal('getComputedStyle', env.getComputedStyle);
  expect(() => applyWebTheme('light', true)).not.toThrow();
  expect(env.attrs.get('data-web-theme')).toBe('light');
});
