import { Building2, UsersRound, Check, ChevronDown } from 'lucide-react';
const modes = [
  {
    title: 'Consultora de selección',
    icon: Building2,
    intro: 'Tus clientes y sus búsquedas, en un mismo espacio.',
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
    title: 'Equipo de RRHH interno',
    icon: UsersRound,
    intro: 'Conectá a RRHH con las áreas de tu empresa.',
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
export const AtsAudience = () => <section id="modalidades" className="ats-section ats-muted-bg">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">A tu manera</span><h2>Un sistema. Dos formas de trabajar.</h2><p>Elegí tu modalidad al crear la empresa.</p></div>
    <div className="ats-grid-2 ats-grid">{modes.map(mode => <article className="ats-card ats-mode-card" key={mode.title}>
      <span className="ats-icon-box"><mode.icon size={26} aria-hidden="true" /></span>
      <h3>{mode.title}</h3><p>{mode.intro}</p>
      <ul className="ats-benefits">{mode.benefits.map(b => <li key={b}><Check size={17} aria-hidden="true" /><span>{b}</span></li>)}</ul>
      <details className="ats-mode-detail"><summary>Ver cómo funciona <ChevronDown size={17} aria-hidden="true" /></summary>
        <ol className="ats-mode-steps">{mode.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
      </details>
    </article>)}</div>
  </div>
</section>;
