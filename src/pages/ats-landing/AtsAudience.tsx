import { Building2, Handshake } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Para Equipos Internos de RRHH",
    description: "Fortalece tu Employer Branding, centraliza tu base de datos y mejora la experiencia de los candidatos desde el día uno.",
  },
  {
    icon: Handshake,
    title: "Para Consultoras y Outsourcing",
    description: "Gestiona múltiples clientes con facilidad, comparte shortlists con un clic en el portal del cliente y cierra más posiciones en menos tiempo.",
  },
];

export const AtsAudience = () => {
  return (
    <section className="ats-section" style={{ paddingBottom: "0" }}>
      <div className="ats-container">
        <div className="ats-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", maxWidth: "60rem", margin: "0 auto" }}>
          {audiences.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="ats-card ats-animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "hsl(var(--ats-primary) / 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <Icon size={24} color="hsl(var(--ats-primary))" />
                </div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>{a.title}</h3>
                <p style={{ color: "hsl(var(--ats-muted-fg))", fontSize: "0.95rem", lineHeight: 1.6 }}>{a.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
