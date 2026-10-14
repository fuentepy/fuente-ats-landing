import { Bot, Kanban, Search, Users2, CalendarCheck2, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Lectura de CVs con IA",
    description:
      "Deja de tipear datos a mano. Nuestra IA lee los CVs por ti, extrayendo experiencia y habilidades al instante, para que te enfoques en evaluar el talento, no en tareas administrativas.",
  },
  {
    icon: Kanban,
    title: "Pipeline visual por vacante",
    description:
      "Postulado, Entrevista, Oferta, Contratado — cada vacante tiene su propio tablero. Arrastrás al candidato de etapa y todo el equipo ve el estado real en tiempo real.",
  },
  {
    icon: Search,
    title: "Búsqueda inteligente de candidatos",
    description:
      "Encontrá al candidato correcto para una nueva vacante dentro de tu propia base, filtrando por habilidades, seniority y experiencia — sin volver a buscar desde cero.",
  },
  {
    icon: CalendarCheck2,
    title: "Entrevistas y evaluaciones centralizadas",
    description:
      "Se acabaron los interminables hilos de WhatsApp y correos perdidos. Agendá, notificá y registrá el feedback en el mismo lugar donde vive el perfil del candidato.",
  },
  {
    icon: Users2,
    title: "Talent Pools reutilizables",
    description:
      "Ese candidato bueno que no calificó para esta vacante no se pierde: queda en un pool listo para la próxima búsqueda con un perfil similar.",
  },
  {
    icon: ShieldCheck,
    title: "Portal para tu cliente final",
    description:
      "Tu cliente ve el avance de sus vacantes sin pedirte un informe: acceso de solo lectura a candidatos, etapas y entrevistas de sus procesos, con permisos por rol.",
  },
];

export const AtsFeatures = () => {
  return (
    <section id="beneficios" className="ats-section ats-muted-bg">
      <div className="ats-container">
        <div className="ats-animate-fade-up" style={{ textAlign: "center", marginBottom: "3.5rem", maxWidth: "40rem", marginLeft: "auto", marginRight: "auto" }}>
          <span className="ats-eyebrow">Beneficios</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", marginTop: "1rem", marginBottom: "1rem" }}>
            Todo lo que tu equipo necesita para <span className="ats-text-gradient">reclutar sin perder el hilo</span>
          </h2>
          <p style={{ color: "hsl(var(--ats-muted-fg))", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Construido para el día a día de una consultora o un equipo de RRHH: rápido de adoptar,
            claro para reportar y ordenado para escalar.
          </p>
        </div>

        <div className="ats-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="ats-card ats-animate-fade-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "hsl(var(--ats-primary) / 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <Icon size={24} color="hsl(var(--ats-primary))" />
                </div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>{f.title}</h3>
                <p style={{ color: "hsl(var(--ats-muted-fg))", fontSize: "0.92rem", lineHeight: 1.55 }}>{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
