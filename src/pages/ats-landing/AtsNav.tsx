import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/landing/logo-fuentepy-color.png";

const links = [
  { id: "beneficios", label: "Beneficios" },
  { id: "producto", label: "El producto" },
  { id: "proceso", label: "El proceso" },
  { id: "planes", label: "Cómo funciona" },
];

export const AtsNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Si la ventana crece a desktop con el menú mobile abierto, cerralo: si no,
  // el panel absoluto queda flotando debajo del nav de escritorio.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: scrolled || menuOpen ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(10px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid hsl(var(--ats-border))" : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div className="ats-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0, flexShrink: 1 }}>
          <img src={logo} alt="FuentePy" style={{ height: "2rem", width: "auto", flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            ATS <span className="ats-text-gradient">Reclutamiento</span>
          </span>
        </div>

        <div style={{ display: "none", alignItems: "center", gap: "2rem" }} className="ats-nav-links">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500, color: "hsl(var(--ats-fg))" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <button className="ats-btn-gradient ats-nav-cta" style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem" }} onClick={() => scrollTo("contacto-ats")}>
            Agendar Demo
          </button>

          <button
            className="ats-nav-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "none", alignItems: "center", justifyContent: "center", width: "2.5rem", height: "2.5rem", border: "1px solid hsl(var(--ats-border))", borderRadius: "0.6rem", background: "#fff", cursor: "pointer" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="ats-nav-mobile-panel ats-animate-fade-in"
          style={{ borderTop: "1px solid hsl(var(--ats-border))", background: "#fff" }}
        >
          <div className="ats-container" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", paddingTop: "0.75rem", paddingBottom: "1rem" }}>
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "0.75rem 0.25rem", fontSize: "1rem", fontWeight: 500, color: "hsl(var(--ats-fg))", borderBottom: "1px solid hsl(var(--ats-border))" }}
              >
                {l.label}
              </button>
            ))}
            <button
              className="ats-btn-gradient"
              style={{ marginTop: "0.75rem", padding: "0.75rem 1.25rem", fontSize: "0.95rem", width: "100%" }}
              onClick={() => scrollTo("contacto-ats")}
            >
              Agendar Demo
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .landing-ats .ats-nav-links { display: flex !important; }
        }
        @media (max-width: 767px) {
          .landing-ats .ats-nav-toggle { display: flex !important; }
          .landing-ats .ats-nav-cta { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
