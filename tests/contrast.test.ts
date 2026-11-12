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
it('WCAG usa los tokens reales: botones, texto grande y texto de cuerpo',()=>{
  const white=color('bg'),primary=color('primary'),secondary=color('secondary'),muted=color('muted');
  const buttonRatios:number[]=[];const titleRatios:number[]=[];
  for(let i=0;i<=100;i++){
    const gradient=primary.map((c,j)=>c+(secondary[j]-c)*i/100);
    buttonRatios.push(ratio(gradient,white));titleRatios.push(ratio(gradient,muted));
  }
  expect(Math.min(...buttonRatios)).toBeGreaterThanOrEqual(4.5);expect(Math.min(...titleRatios)).toBeGreaterThanOrEqual(4.5);
  for(const fg of ['fg','muted-fg'])for(const bg of ['bg','muted'])expect(ratio(color(fg),color(bg))).toBeGreaterThanOrEqual(4.5);
  const eyebrowBg=primary.map((v,i)=>v*.08+white[i]*.92);expect(ratio(primary,eyebrowBg)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(color('control-border'),white)).toBeGreaterThanOrEqual(3);
  console.info(`Contraste mínimo: botón ${Math.min(...buttonRatios).toFixed(2)}:1; título ${Math.min(...titleRatios).toFixed(2)}:1`);
});
it('mantiene foco y reducción de movimiento en CSS',()=>{
  expect(css).toContain(':focus-visible');expect(css).toContain('prefers-reduced-motion: reduce');expect(css).toContain('scroll-behavior: auto');
  expect(css).toContain('background: linear-gradient(135deg, hsl(var(--ats-primary)), hsl(var(--ats-secondary)))');
});
