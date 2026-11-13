import { readFileSync } from 'node:fs';
import { it, expect } from 'vitest';
const css=readFileSync('src/pages/ats-landing/styles.css','utf8');
function color(token:string) {
  const match=css.match(new RegExp(`--ats-${token}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`));
  if(!match)throw new Error(`Missing real CSS token ${token}`);
  const h=Number(match[1])/60,s=Number(match[2])/100,l=Number(match[3])/100;
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h%2-1)),m=l-c/2;
  const rgb=h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x];
  return rgb.map(v=>v+m);
}
const lum=(rgb:number[])=>rgb.map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);
const ratio=(a:number[],b:number[])=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
it('WCAG usa los tokens reales del tema oscuro: botones, texto de cuerpo y acentos',()=>{
  const bg=color('bg'),card=color('card'),muted=color('muted'),primary=color('primary'),secondary=color('secondary'),onPrimary=color('on-primary');
  const buttonRatios:number[]=[];const titleRatios:number[]=[];
  for(let i=0;i<=100;i++){
    const gradient=primary.map((c,j)=>c+(secondary[j]-c)*i/100);
    buttonRatios.push(ratio(onPrimary,gradient));titleRatios.push(ratio(gradient,bg));
  }
  expect(Math.min(...buttonRatios)).toBeGreaterThanOrEqual(4.5);expect(Math.min(...titleRatios)).toBeGreaterThanOrEqual(4.5);
  for(const fg of ['fg','muted-fg'])for(const surface of [bg,muted,card])expect(ratio(color(fg),surface)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(primary,card)).toBeGreaterThanOrEqual(4.5);
  const eyebrowBg=primary.map((v,i)=>v*.1+bg[i]*.9);expect(ratio(primary,eyebrowBg)).toBeGreaterThanOrEqual(4.5);
  for(const surface of [bg,card])expect(ratio(color('control-border'),surface)).toBeGreaterThanOrEqual(3);
  console.info(`Contraste mínimo: botón ${Math.min(...buttonRatios).toFixed(2)}:1; título ${Math.min(...titleRatios).toFixed(2)}:1`);
});
it('mantiene foco y reducción de movimiento en CSS',()=>{
  expect(css).toContain(':focus-visible');expect(css).toContain('prefers-reduced-motion: reduce');expect(css).toContain('scroll-behavior: auto');
  expect(css).toContain('background: linear-gradient(135deg, hsl(var(--ats-primary)), hsl(var(--ats-secondary)))');
  // La aparición al hacer scroll solo se activa por JavaScript (clase ats-motion): sin JS todo es visible.
  expect(css).toContain('.landing-ats.ats-motion .ats-reveal');
  expect(css).not.toMatch(/\n\.landing-ats \.ats-reveal \{[^}]*opacity: 0/);
});

it('pestañas: mide texto y público con los tokens de sus reglas CSS reales', () => {
  const rule = (selector: string) => {
    const start = css.indexOf(`${selector} {`); expect(start).toBeGreaterThanOrEqual(0);
    return css.slice(start + selector.length + 2, css.indexOf('}', start));
  };
  const token = (block: string, property: string) => {
    const match = block.match(new RegExp(`(?:^|;)\\s*${property}:\\s*hsl\\(var\\(--ats-([a-z-]+)\\)\\)`));
    if (!match) throw new Error(`No token CSS para ${property}`);
    return color(match[1]);
  };
  const base = rule('.landing-ats .ats-showcase-tab');
  const selected = rule('.landing-ats .ats-showcase-tab[aria-selected="true"]');
  const audience = rule('.landing-ats .ats-showcase-tab-audience');
  const hover = rule('.landing-ats .ats-showcase-tab:hover:not([aria-selected="true"])');
  expect(rule('.landing-ats .ats-showcase-tab[aria-selected="true"] .ats-showcase-tab-audience')).toContain('color: inherit');
  const measurements = [
    ratio(token(base, 'color'), token(base, 'background')),
    ratio(token(audience, 'color'), token(base, 'background')),
    ratio(token(base, 'color'), token(hover, 'background')),
    ratio(token(audience, 'color'), token(hover, 'background')),
    ratio(token(selected, 'color'), token(selected, 'background')),
  ];
  measurements.forEach(value => expect(value).toBeGreaterThanOrEqual(4.5));
  console.info(`Pestañas: normal ${measurements[0].toFixed(2)}:1; público ${measurements[1].toFixed(2)}:1; hover ${measurements[2].toFixed(2)}/${measurements[3].toFixed(2)}:1; activa ${measurements[4].toFixed(2)}:1`);
});
