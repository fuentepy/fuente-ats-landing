import { useEffect } from 'react';
// Aparición suave al hacer scroll. Sin JS, o con movimiento reducido, todo queda visible desde el inicio.
export function useReveal() {
  useEffect(() => {
    const root = document.querySelector('.landing-ats');
    if (!root || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.ats-reveal'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    root.classList.add('ats-motion');
    items.forEach(item => observer.observe(item));
    return () => { observer.disconnect(); root.classList.remove('ats-motion'); };
  }, []);
}
