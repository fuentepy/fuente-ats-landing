const modes = [
  {
    title: 'Consultora de selección',
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
    <div className="ats-section-heading"><span className="ats-eyebrow">Dos formas de trabajar</span><h2>Un recorrido para tu equipo</h2><p>Elegí la modalidad al comenzar y seguí la guía de puesta en marcha.</p></div>
    <div className="ats-grid-2 ats-grid">{modes.map(mode => <article className="ats-card" key={mode.title}>
      <h3>{mode.title}</h3><ul className="ats-benefits">{mode.benefits.map(b => <li key={b}>{b}</li>)}</ul>
      <ol className="ats-mode-steps">{mode.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
    </article>)}</div>
  </div>
</section>;
