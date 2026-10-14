const steps = [
  {
    n: "01",
    title: "Cargamos tus vacantes y equipo",
    description: "Migramos tus procesos abiertos y damos de alta a tu equipo de reclutadores con permisos por rol.",
  },
  {
    n: "02",
    title: "Tu equipo recluta en el sistema",
    description: "Candidatos, CVs, entrevistas y ofertas se cargan y avanzan de etapa desde un solo lugar, sin planillas paralelas.",
  },
  {
    n: "03",
    title: "Tu cliente ve resultados, no procesos",
    description: "Reportes y portal de cliente listos para compartir el avance sin armar un informe a mano cada semana.",
  },
];

export const AtsHowItWorks = () => {
  return (
    <section id="planes" className="ats-section ats-dark-bg">
      <div className="ats-container">
        <div className="ats-animate-fade-up" style={{ textAlign: "center", marginBottom: "3.5rem", maxWidth: "38rem", marginLeft: "auto", marginRight: "auto" }}>
          <span className="ats-eyebrow" style={{ background: "rgba(255,255,255,0.1)", color: "hsl(var(--ats-secondary))" }}>Cómo funciona</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", marginTop: "1rem", color: "#fff" }}>
            Implementación en días, no en meses
          </h2>
        </div>

        <div className="ats-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {steps.map((s, idx) => (
            <div key={s.n} className="ats-animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="ats-text-gradient" style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>{s.n}</div>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.6rem" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.6 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
