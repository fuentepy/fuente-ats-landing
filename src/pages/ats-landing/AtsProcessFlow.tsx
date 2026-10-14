import {
  ClipboardList, Briefcase, Search, FileSearch, MessagesSquare, Presentation,
  FileSignature, PartyPopper, ArrowRight, ArrowDown, type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ROW_1: Step[] = [
  { icon: ClipboardList, title: "Solicitud", description: "El cliente pide un perfil." },
  { icon: Briefcase, title: "Vacante", description: "Creás y publicás el puesto." },
  { icon: Search, title: "Atraer", description: "Buscás en tu base y recibís postulaciones." },
  { icon: FileSearch, title: "Filtrar CV", description: "Revisás candidatos y los movés de etapa." },
];

const ROW_2: Step[] = [
  { icon: MessagesSquare, title: "Entrevistar", description: "Entrevista inicial, técnica y test." },
  { icon: Presentation, title: "Presentar", description: "El cliente ve los perfiles en su portal." },
  { icon: FileSignature, title: "Cerrar", description: "Propuesta comercial y oferta laboral." },
  { icon: PartyPopper, title: "Contratado", description: "Búsqueda o tercerización, todo registrado." },
];

function Nodo({ step, n, delay }: { step: Step; n: number; delay: number }) {
  const Icon = step.icon;
  return (
    <div className="ats-flow-node ats-animate-fade-up" style={{ animationDelay: `${delay}s` }}>
      <div className="ats-flow-icon">
        <Icon size={22} color="hsl(var(--ats-primary))" />
        <span className="ats-flow-badge">{n}</span>
      </div>
      <h3 className="ats-flow-title">{step.title}</h3>
      <p className="ats-flow-desc">{step.description}</p>
    </div>
  );
}

function Flecha() {
  return (
    <span className="ats-flow-arrow" aria-hidden="true">
      <ArrowRight className="ats-flow-arrow-h" size={20} />
      <ArrowDown className="ats-flow-arrow-v" size={20} />
    </span>
  );
}

function Fila({ pasos, offset }: { pasos: Step[]; offset: number }) {
  return (
    <div className="ats-flow-row">
      {pasos.map((s, i) => (
        <div key={s.title} className="ats-flow-item">
          <Nodo step={s} n={offset + i + 1} delay={(offset + i) * 0.06} />
          {i < pasos.length - 1 && <Flecha />}
        </div>
      ))}
    </div>
  );
}

export const AtsProcessFlow = () => {
  return (
    <section id="proceso" className="ats-section ats-muted-bg">
      <div className="ats-container">
        <div className="ats-animate-fade-up" style={{ textAlign: "center", marginBottom: "3.5rem", maxWidth: "40rem", marginLeft: "auto", marginRight: "auto" }}>
          <span className="ats-eyebrow">El proceso</span>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", marginTop: "1rem", marginBottom: "1rem" }}>
            Una búsqueda, <span className="ats-text-gradient">de punta a punta</span>
          </h2>
          <p style={{ color: "hsl(var(--ats-muted-fg))", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Ocho momentos, un solo sistema: desde que llega el pedido del cliente hasta que la
            persona está contratada, sin planillas ni hilos de correo paralelos.
          </p>
        </div>

        <div className="ats-flow">
          <Fila pasos={ROW_1} offset={0} />
          <div className="ats-flow-connector" aria-hidden="true">
            <ArrowDown size={22} />
          </div>
          <Fila pasos={ROW_2} offset={4} />
        </div>
      </div>
    </section>
  );
};
