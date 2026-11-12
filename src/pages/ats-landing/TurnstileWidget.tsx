import { useEffect, useRef, useState } from 'react';
interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
}
declare global { interface Window { turnstile?: TurnstileApi } }
let scriptPromise: Promise<void> | undefined;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); scriptPromise = undefined; reject(new Error('captcha unavailable')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}
export function TurnstileWidget({siteKey, onToken}: {siteKey:string;onToken:(value:string)=>void}) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true; let widget: string | undefined;
    loadTurnstile().then(() => {
      if (!active || !container.current || !window.turnstile) return;
      widget = window.turnstile.render(container.current, {sitekey:siteKey,action:'contact-lead',size:'flexible',
        callback:(token:string) => {if(active)onToken(token);},
        'expired-callback':() => {if(active)onToken('');},
        'error-callback':() => {if(active){onToken('');setFailed(true);}},
      });
    }).catch(() => { if(active)setFailed(true); });
    return () => {active=false;if(widget !== undefined)window.turnstile?.remove(widget);};
  },[siteKey,onToken]);
  return <div><div ref={container} aria-label="Verificación de seguridad" />{failed && <p role="alert">No pudimos cargar la verificación. Recargá la página o escribinos a contacto@fuentehr.com.</p>}</div>;
}
