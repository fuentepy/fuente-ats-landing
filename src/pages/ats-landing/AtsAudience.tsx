import { Building2, Briefcase } from "lucide-react";
const modes = [
  {
    Icon: Briefcase,
    title: 'Consultora de selección',
    lead: 'Tus clientes y sus búsquedas, en un mismo espacio.',
    steps: [
      ['Solicitud del cliente', 'Recibí el pedido del perfil que necesita.'],
      ['Propuesta comercial, cuando corresponde', 'Presentala antes de la vacante. Es opcional si creás la vacante directamente.'],
      ['Vacante', 'Organizá la búsqueda y decidí si la publicás.'],
      ['Selección', 'Revisá perfiles y avanzá por las etapas del proceso.'],
      ['Colaboración con el cliente', 'Compartí perfiles por etapa, comentarios y evaluaciones en el portal.'],
      ['Contratación', 'Registrá el cierre del proceso.'],
    ],
    benefits: ['Clientes en un mismo lugar', 'Solicitudes de nuevos perfiles', 'Propuestas comerciales antes de la vacante', 'Portal para colaborar con cada cliente'],
  },
  {
    Icon: Building2,
    title: 'Equipo de RRHH interno',
    lead: 'Las áreas piden, RRHH decide y coordina.',
    steps: [
      ['Solicitud del área', 'El responsable pide una búsqueda para su área.'],
      ['Revisión de RRHH', 'Al aprobarla, RRHH crea la vacante en borrador.'],
      ['Vacante', 'Mantenela activa sin publicarla si la búsqueda es interna.'],
      ['Selección', 'RRHH revisa candidatos y avanza por las etapas.'],
      ['Perfiles compartidos', 'Los responsables asignados ven perfiles en las etapas compartidas. Proponen horarios de entrevista y RRHH los confirma.'],
      ['Evaluación y contratación', 'Reuní las evaluaciones y registrá la decisión.'],
    ],
    benefits: ['Áreas con sus propios responsables', 'Responsables de contratación asignados por proceso', 'Búsquedas activas sin publicación pública', 'Perfiles compartidos por etapa'],
  },
];
export const AtsAudience = () => <section id="modalidades" className="ats-section">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">Dos formas de trabajar</span><h2>Un sistema, dos modalidades</h2><p>Elegí la tuya al crear la empresa.</p></div>
    <div className="ats-grid-2 ats-grid">{modes.map(({ Icon, ...mode }) => <article className="ats-card ats-reveal" key={mode.title}>
      <span className="ats-icon" aria-hidden="true"><Icon size={22} /></span>
      <h3>{mode.title}</h3><p className="ats-card-lead">{mode.lead}</p>
      <ul className="ats-benefits">{mode.benefits.map(b => <li key={b}>{b}</li>)}</ul>
      <details className="ats-more"><summary>Ver el recorrido paso a paso</summary>
        <ol className="ats-mode-steps">{mode.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
      </details>
    </article>)}</div>
  </div>
</section>;
