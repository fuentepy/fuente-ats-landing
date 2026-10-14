import { ArrowRight, PlayCircle, Sparkles, ShieldCheck, Zap, Server } from "lucide-react";

const stats = [
  { n: "-70%", l: "tiempo de screening con IA" },
  { n: "4", l: "etapas de pipeline, siempre visibles" },
  { n: "100%", l: "trazable para tu cliente final" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Datos 100% Seguros y Privados" },
  { icon: Zap, label: "Procesamiento con IA de Última Generación" },
  { icon: Server, label: "Infraestructura Escalable de Alta Disponibilidad" },
];

export const AtsHero = () => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, hsl(var(--ats-bg)), hsl(var(--ats-muted)) 60%, hsl(var(--ats-bg)))" }}>
        <div className="ats-animate-float" style={{ position: "absolute", top: "10%", right: "8%", width: "22rem", height: "22rem", background: "hsl(var(--ats-primary) / 0.16)", borderRadius: "9999px", filter: "blur(70px)" }} />
        <div className="ats-animate-float" style={{ position: "absolute", bottom: "5%", left: "5%", width: "20rem", height: "20rem", background: "hsl(var(--ats-secondary) / 0.18)", borderRadius: "9999px", filter: "blur(70px)", animationDelay: "1.2s" }} />
      </div>

      <div className="ats-container" style={{ position: "relative", zIndex: 10, paddingTop: "7rem", paddingBottom: "4rem", width: "100%" }}>
        <div className="ats-animate-fade-up" style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto" }}>
          <span className="ats-eyebrow">
            <Sparkles size={14} /> Software ATS con lectura de CVs por IA
          </span>

          <h1 style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", lineHeight: 1.08, marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            Multiplica la velocidad de tus contrataciones{" "}
            <span className="ats-text-gradient">y centraliza tu talento</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "hsl(var(--ats-muted-fg))", marginBottom: "2.25rem", lineHeight: 1.6, maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            El ATS diseñado para que Equipos de RRHH y Consultoras gestionen vacantes, filtren CVs
            con IA y presenten candidatos al cliente final en tiempo récord. Menos planillas, más
            talento contratado.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "2.5rem" }}>
            <button className="ats-btn-gradient" onClick={() => scrollTo("contacto-ats")}>
              Agendar Demo <ArrowRight size={18} />
            </button>
            <button className="ats-btn-outline" onClick={() => scrollTo("producto")}>
              <PlayCircle size={18} /> Ver el sistema en acción
            </button>
          </div>

          <div
            style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.75rem",
              marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid hsl(var(--ats-border))",
            }}
          >
            {trustBadges.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "hsl(var(--ats-muted-fg))" }}>
                  <Icon size={16} color="hsl(var(--ats-primary))" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{b.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "34rem", margin: "0 auto" }}>
            {stats.map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div className="ats-text-gradient" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 700, marginBottom: "0.25rem" }}>{s.n}</div>
                <div style={{ fontSize: "0.8rem", color: "hsl(var(--ats-muted-fg))" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
