import { GitBranch, Sparkles, MessagesSquare, UserRoundCheck, Settings2, ChevronDown } from 'lucide-react';
const features = [
  { icon: GitBranch, title: 'Pipeline configurable', short: 'Las etapas de tu empresa. El avance de todas tus búsquedas.', detail: 'Definí las etapas de tu empresa y seguí el avance de las postulaciones de todas tus vacantes.' },
  { icon: Sparkles, title: 'CVs con apoyo de IA', short: 'Lectura de CVs como ayuda, con revisión humana.', detail: 'Usá la lectura de CVs como ayuda. Puede dar resultados incompletos: revisá la información antes de decidir.' },
  { icon: MessagesSquare, title: 'Colaboración con el cliente', short: 'Compartí perfiles y centralizá la colaboración.', detail: 'El cliente ve sus vacantes y los perfiles compartidos según la etapa. Puede comentar, proponer horarios, descartar con motivo, evaluar entrevistas, pedir nuevos perfiles y responder propuestas comerciales.' },
  { icon: UserRoundCheck, title: 'Áreas y responsables de contratación', short: 'Cada responsable, en los procesos que le asignás.', detail: 'En RRHH interno, asigná responsables a los procesos y compartí perfiles por etapa. Los responsables proponen horarios de entrevista y RRHH los confirma.' },
];
export const AtsFeatures = () => <section id="funciones" className="ats-section">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">Menos dispersión</span><h2>Conectá las partes de tu proceso.</h2><p>Las herramientas de selección, en el mismo lugar.</p></div>
    <div className="ats-feature-grid">{features.map(feature => <article key={feature.title} className="ats-feature-card">
      <span className="ats-icon-box"><feature.icon size={23} aria-hidden="true" /></span>
      <h3>{feature.title}</h3><p>{feature.short}</p>
      <details><summary>Ver detalles <ChevronDown size={16} aria-hidden="true" /></summary><p>{feature.detail}</p></details>
    </article>)}</div>
    <aside className="ats-control-note"><Settings2 size={25} aria-hidden="true" /><div><h3>Vos decidís qué se publica y qué se avisa</h3><p>Activar una vacante no la publica. Los avisos por correo a candidatos están apagados por defecto.</p><details><summary>Conocé los controles <ChevronDown size={16} aria-hidden="true" /></summary><p>Mostrar una vacante en la bolsa pública es una acción aparte. Podés habilitar los avisos por correo etapa por etapa.</p></details></div></aside>
  </div>
</section>;
