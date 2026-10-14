import { Star } from "lucide-react";

type Card = { name: string; role: string; score: number };

const columns: { title: string; cards: Card[] }[] = [
  {
    title: "Postulado",
    cards: [
      { name: "Lucía Benítez", role: "Backend Node.js", score: 85 },
      { name: "Diego Franco", role: "Backend Node.js", score: 70 },
    ],
  },
  {
    title: "Entrevista",
    cards: [
      { name: "Marcos Villalba", role: "Analista de Datos", score: 90 },
      { name: "Sofía Giménez", role: "QA Automation", score: 78 },
    ],
  },
  {
    title: "Oferta",
    cards: [{ name: "Camila Salinas", role: "Abogada Jr. Corporativo", score: 88 }],
  },
  {
    title: "Contratado",
    cards: [{ name: "Fabián Mendoza", role: "Rep. de Ventas", score: 92 }],
  },
];

export const AtsShowcase = () => {
  return (
    <section id="producto" className="ats-section">
      <div className="ats-container">
        <div className="ats-animate-fade-up" style={{ textAlign: "center", marginBottom: "3rem", maxWidth: "40rem", marginLeft: "auto", marginRight: "auto" }}>
          <span className="ats-eyebrow">El producto</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", marginTop: "1rem", marginBottom: "1rem" }}>
            Una interfaz <span className="ats-text-gradient">limpia y sin curva de aprendizaje</span>
          </h2>
          <p style={{ color: "hsl(var(--ats-muted-fg))", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Así se ve el pipeline de una vacante activa: cada candidato con su puntaje de match,
            listo para mover de etapa con un clic.
          </p>
        </div>

        <div className="ats-animate-fade-in ats-browser" style={{ animationDelay: "0.1s", maxWidth: "62rem", margin: "0 auto" }}>
          <div className="ats-browser-bar">
            <span className="ats-browser-dot" />
            <span className="ats-browser-dot" />
            <span className="ats-browser-dot" />
            <span className="ats-browser-url">app.tuempresa.com/vacantes/analista-datos</span>
          </div>

          <div className="ats-kanban">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="ats-kanban-col-title">
                  {col.title}
                  <span className="ats-kanban-count">{col.cards.length}</span>
                </div>
                {col.cards.map((c) => (
                  <div key={c.name} className="ats-candidate-card">
                    <div className="ats-candidate-name">{c.name}</div>
                    <div className="ats-candidate-role">{c.role}</div>
                    <span className="ats-score-pill">
                      <Star size={10} fill="currentColor" /> {c.score}% match
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          className="ats-animate-fade-up"
          style={{ animationDelay: "0.2s", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem", marginTop: "2.5rem", color: "hsl(var(--ats-muted-fg))", fontSize: "0.9rem" }}
        >
          <span>✓ Perfil extraído del CV en segundos</span>
          <span>✓ Filtros por skill, seniority y cliente</span>
          <span>✓ Historial completo por candidato</span>
        </div>
      </div>
    </section>
  );
};
