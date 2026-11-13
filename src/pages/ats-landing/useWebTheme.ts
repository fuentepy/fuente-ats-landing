import { useEffect, useState } from 'react';
export type WebTheme = 'dark' | 'light';
export const WEB_THEME_KEY = 'fuentehr-web-theme';

export function applyWebTheme(theme: WebTheme, persist = false) {
  document.documentElement.setAttribute('data-web-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.documentElement).backgroundColor);
  if (persist) {
    try { localStorage.setItem(WEB_THEME_KEY, theme); } catch { /* Preferencia de esta visita. */ }
  }
}

export function useWebTheme() {
  const [theme, setTheme] = useState<WebTheme>(() => typeof document !== 'undefined' && document.documentElement.getAttribute('data-web-theme') === 'light' ? 'light' : 'dark');
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WEB_THEME_KEY && event.key !== null) return;
      const next = event.newValue === 'light' ? 'light' : 'dark';
      applyWebTheme(next); setTheme(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyWebTheme(next, true); setTheme(next);
  };
  return { theme, toggleTheme };
}
