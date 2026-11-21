import { useEffect } from 'react';
// La página se dibuja con JavaScript: cuando el navegador intenta ir a /#seccion todavía no existe el elemento y
// no baja. Se repite el salto una vez que está dibujada y otra cuando termina de cargar (imágenes, tipografías),
// salvo que la persona ya haya empezado a moverse por la página.
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let moved = false;
    const stop = () => { moved = true; };
    const events = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
    events.forEach(name => window.addEventListener(name, stop, { passive: true, once: true }));
    const go = () => {
      if (moved) return;
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
    };
    go();
    const timer = window.setTimeout(go, 600);
    window.addEventListener('load', go, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', go);
      events.forEach(name => window.removeEventListener(name, stop));
    };
  }, []);
}
