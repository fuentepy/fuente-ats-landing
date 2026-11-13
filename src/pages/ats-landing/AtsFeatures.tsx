import { BellOff, EyeOff, Handshake, Network, Sparkles, Workflow } from "lucide-react";
const features = [
  [Workflow, 'Pipeline configurable', 'Tus etapas, tu proceso.', 'Definí las etapas de tu empresa y seguí el avance de las postulaciones de todas tus vacantes.'],
  [Sparkles, 'CVs con apoyo de IA', 'Una ayuda, no una decisión.', 'Usá la lectura de CVs como ayuda. Puede dar resultados incompletos: revisá la información antes de decidir.'],
  [Handshake, 'Colaboración con el cliente', 'Tu cliente ve y opina en cada etapa.', 'El cliente ve sus vacantes y los perfiles compartidos según la etapa. Puede comentar, proponer horarios, descartar con motivo, evaluar entrevistas, pedir nuevos perfiles y responder propuestas comerciales.'],
  [Network, 'Áreas y responsables de contratación', 'Cada área con sus responsables.', 'En RRHH interno, asigná responsables a los procesos y compartí perfiles por etapa. Los responsables proponen horarios de entrevista y RRHH los confirma.'],
] as const;
export const AtsFeatures = () => <section id="funciones" className="ats-section ats-muted-bg">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">Funciones</span><h2>El proceso en un mismo lugar</h2></div>
    <div className="ats-grid ats-grid-2">{features.map(([Icon, title, short, text]) => <article key={title} className="ats-card ats-reveal">
      <span className="ats-icon" aria-hidden="true"><Icon size={22} /></span>
      <h3>{title}</h3><p className="ats-card-lead">{short}</p>
      <details className="ats-more"><summary>Ver detalles</summary><p>{text}</p></details>
    </article>)}</div>
    <aside className="ats-control-note ats-reveal">
      <div><h3>Vos decidís qué se publica y qué se avisa</h3>
        <ul className="ats-control-points"><li><EyeOff aria-hidden="true" size={18} />Activar no es publicar</li><li><BellOff aria-hidden="true" size={18} />Avisos a candidatos apagados</li></ul></div>
      <details className="ats-more"><summary>Cómo funciona</summary><p>Activar una vacante no la publica: mostrarla en la bolsa pública es una acción aparte. Los avisos por correo a candidatos están apagados por defecto; podés habilitarlos etapa por etapa.</p></details>
    </aside>
  </div>
</section>;
