const modes = [
  {
    title: 'Consultora de selección',
    steps: [
      ['Solicitud del cliente', 'Un cliente te pide un perfil y lo registrás como solicitud.'],
      ['Propuesta comercial, cuando corresponde', 'Si corresponde, le presentás una propuesta comercial antes de la vacante. Con la propuesta aceptada, o directamente, creás la vacante.'],
      ['Vacante', 'Organizás la búsqueda y decidís si la publicás.'],
      ['Selección', 'Revisás perfiles y avanzás por las etapas del proceso.'],
      ['Colaboración con el cliente', 'Compartís perfiles con el cliente por etapa. Desde su portal, comenta, propone horarios y evalúa entrevistas.'],
      ['Contratación', 'Al final, registrás la contratación.'],
    ],
    benefits: ['Clientes en un mismo lugar', 'Solicitudes de nuevos perfiles', 'Propuestas comerciales antes de la vacante', 'Portal para colaborar con cada cliente'],
  },
  {
    title: 'Equipo de RRHH interno',
    steps: [
      ['Solicitud del área', 'Recibís la solicitud de un área que necesita cubrir un puesto.'],
      ['Revisión de RRHH', 'Desde RRHH revisás la solicitud y, al aprobarla, creás la vacante en borrador.'],
      ['Vacante', 'Mantenés la búsqueda activa sin publicarla si es interna.'],
      ['Selección', 'Revisás los candidatos y avanzás por las etapas.'],
      ['Perfiles compartidos', 'El responsable asignado ve los perfiles de las etapas compartidas y propone horarios de entrevista. Desde RRHH los confirmás.'],
      ['Evaluación y contratación', 'Reunís las evaluaciones y registrás la decisión.'],
    ],
    benefits: ['Áreas con sus propios responsables', 'Responsables de contratación asignados por proceso', 'Búsquedas activas sin publicación pública', 'Perfiles compartidos por etapa'],
  },
];
export const AtsAudience = () => <section id="modalidades" className="ats-section">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">Dos formas de trabajar</span><h2>Así se ve un proceso, de la solicitud a la contratación</h2><p id="historia-aviso">Ejemplo ilustrativo, no es un caso de cliente</p></div>
    <div className="ats-grid-2 ats-grid">{modes.map(mode => <article className="ats-card" key={mode.title}>
      <h3>{mode.title}</h3><ul className="ats-benefits">{mode.benefits.map(b => <li key={b}>{b}</li>)}</ul>
      <ol className="ats-mode-steps">{mode.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
    </article>)}</div>
  </div>
</section>;
