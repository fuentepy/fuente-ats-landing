import { readFileSync } from 'node:fs';
import { it, expect } from 'vitest';
const css = readFileSync('src/pages/ats-landing/styles.css', 'utf8');
const themeCss = readFileSync('public/web-theme.css', 'utf8');
const base = themeCss.match(/:root\s*\{([\s\S]*?)\}/)![1];
const light = themeCss.match(/:root\[data-web-theme="light"\]\s*\{([\s\S]*?)\}/)![1];
function color(token: string, mode: 'dark' | 'light') {
  const regexp = new RegExp(`--ats-${token}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`);
  const match = (mode === 'light' ? light.match(regexp) : null) ?? base.match(regexp);
  if (!match) throw new Error(`Missing token ${token}`);
  const h = Number(match[1]) / 60, s = Number(match[2]) / 100, l = Number(match[3]) / 100;
  const c = (1 - Math.abs(2*l - 1))*s, x = c*(1 - Math.abs(h%2 - 1)), m = l - c/2;
  const rgb = h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x];
  return rgb.map(v => v + m);
}
const lum = (rgb: number[]) => rgb.map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4).reduce((v,c,i) => v+c*[.2126,.7152,.0722][i],0);
const ratio = (a: number[], b: number[]) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const blend = (a: number[], b: number[], k: number) => a.map((v,i) => v*k + b[i]*(1-k));
for (const mode of ['dark', 'light'] as const) {
  it(`contraste real ${mode}: texto, pestañas, controles, error y degradados`, () => {
    const c = (token: string) => color(token, mode);
    const surfaces = ['bg','muted','card','ink'].map(c);
    const textRatios: number[] = [], buttonRatios: number[] = [], accentRatios: number[] = [];
    for (const foreground of ['fg','muted-fg','primary','error']) for (const bg of surfaces) {
      const value=ratio(c(foreground),bg); expect(value,`${mode}: ${foreground}`).toBeGreaterThanOrEqual(4.5); textRatios.push(value);
    }
    for (let i=0;i<=100;i++) {
      const button=blend(c('secondary'),c('primary'),i/100);
      const title=i<=55?blend(c('secondary'),c('primary'),i/55):blend(c('tertiary'),c('secondary'),(i-55)/45);
      buttonRatios.push(ratio(c('on-primary'),button)); accentRatios.push(ratio(title,c('bg')));
    }
    expect(Math.min(...buttonRatios)).toBeGreaterThanOrEqual(4.5);
    expect(Math.min(...accentRatios)).toBeGreaterThanOrEqual(4.5);
    for (const bg of surfaces) expect(ratio(c('control-border'),bg)).toBeGreaterThanOrEqual(3);
    const eyebrow=blend(c('primary'),c('bg'),.1); expect(ratio(c('primary'),eyebrow)).toBeGreaterThanOrEqual(4.5);
    // El brillo real es 16% oscuro / 7% claro: se contempla la combinación más intensa.
    const glow=blend(c('primary'),c('bg'),mode==='dark'?.16:.07);
    expect(ratio(c('fg'),glow)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(c('muted-fg'),glow)).toBeGreaterThanOrEqual(4.5);
    console.info(`${mode}: texto mínimo ${Math.min(...textRatios).toFixed(2)}:1; botón ${Math.min(...buttonRatios).toFixed(2)}:1; título ${Math.min(...accentRatios).toFixed(2)}:1`);
  });
  it(`pestañas ${mode}: usa las parejas de tokens de las reglas CSS`, () => {
    const rule=(selector:string)=>{const start=css.indexOf(`${selector} {`);expect(start).toBeGreaterThanOrEqual(0);return css.slice(start+selector.length+2,css.indexOf('}',start));};
    const token=(block:string,property:string)=>{const m=block.match(new RegExp(`(?:^|;)\\s*${property}:\\s*hsl\\(var\\(--ats-([a-z-]+)\\)\\)`));if(!m)throw new Error('Token ausente');return color(m[1],mode);};
    const normal=rule('.landing-ats .ats-showcase-tab'), selected=rule('.landing-ats .ats-showcase-tab[aria-selected="true"]');
    const audience=rule('.landing-ats .ats-showcase-tab-audience'), hover=rule('.landing-ats .ats-showcase-tab:hover:not([aria-selected="true"])');
    expect(rule('.landing-ats .ats-showcase-tab[aria-selected="true"] .ats-showcase-tab-audience')).toContain('color: inherit');
    for(const bg of [token(normal,'background'),token(hover,'background')])for(const fg of [token(normal,'color'),token(audience,'color')])expect(ratio(fg,bg)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(token(selected,'color'),token(selected,'background'))).toBeGreaterThanOrEqual(4.5);
  });
}
it('mantiene foco, controles de 44 px y reducción de movimiento', () => {
  expect(css).toContain(':focus-visible');expect(css).toContain('prefers-reduced-motion: reduce');expect(css).toContain('animation: none !important');
  expect(css).toContain('width: 44px; height: 44px');
  expect(css).toContain('.landing-ats.ats-motion .ats-reveal');
});
