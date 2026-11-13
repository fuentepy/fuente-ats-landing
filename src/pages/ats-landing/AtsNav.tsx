import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { APP_LINKS } from "@/lib/links";

import type { WebTheme } from "./useWebTheme";

const links = [
  { id: "modalidades", label: "Modalidades" },
  { id: "funciones", label: "Funciones" },
  { id: "como-empezar", label: "Cómo empezar" },
  { id: "contacto-ats", label: "Demo" },
];
export const AtsNav = ({ theme, onToggleTheme }: { theme: WebTheme; onToggleTheme: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const resize = () => { if (window.innerWidth >= 1100) setMenuOpen(false); };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) { setMenuOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('keydown', escape); };
  }, [menuOpen]);
  const navigation = () => <>
    {links.map(link => <a key={link.id} href={`#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
    <a href={APP_LINKS.login}>Iniciar sesión</a>
    <a href={APP_LINKS.signup} className="ats-btn-gradient">Crear empresa</a>
  </>;
  return <header className="ats-header">
    <a href="#contenido" className="ats-skip-link">Saltar al contenido</a>
    <div className="ats-container ats-nav-bar">
      <a href="#inicio" aria-label="FuenteHR, inicio"><img src={theme === 'light' ? '/logo-fuentehr-light.png' : '/logo-fuentehr.png'} alt="FuenteHR" width={150} height={50} /></a>
      <nav aria-label="Navegación principal" className="ats-nav-desktop">{navigation()}</nav>
      <div className="ats-header-actions">
      <a href={APP_LINKS.login} className="ats-header-login">Iniciar sesión</a>
      <button type="button" className="ats-theme-toggle" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'} title={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'}>
        {theme === 'dark' ? <Sun size={21} aria-hidden="true" /> : <Moon size={21} aria-hidden="true" />}
      </button>
      <button ref={toggle} type="button" className="ats-nav-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="menu-movil" onClick={() => setMenuOpen(v => !v)}>
        {menuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
      </button>
      </div>
    </div>
    <nav id="menu-movil" aria-label="Navegación móvil" className="ats-container ats-nav-mobile" hidden={!menuOpen}>{navigation()}</nav>
  </header>;
};
