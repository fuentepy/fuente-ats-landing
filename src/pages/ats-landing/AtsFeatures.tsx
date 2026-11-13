const features = [
  ['Pipeline configurable', 'Definí las etapas de tu empresa y seguí el avance de las postulaciones de todas tus vacantes.'],
  ['CVs con apoyo de IA', 'Usá la lectura de CVs como ayuda. Puede dar resultados incompletos: revisá la información antes de decidir.'],
  ['Colaboración con el cliente', 'El cliente ve sus vacantes y los perfiles compartidos según la etapa. Puede comentar, proponer horarios, descartar con motivo, evaluar entrevistas, pedir nuevos perfiles y responder propuestas comerciales.'],
  ['Áreas y responsables de contratación', 'En RRHH interno, asigná responsables a los procesos y compartí perfiles por etapa. Los responsables proponen horarios de entrevista y RRHH los confirma.'],
];
export const AtsFeatures = () => <section id="funciones" className="ats-section ats-muted-bg">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">Funciones</span><h2>El proceso en un mismo lugar</h2></div>
    <div className="ats-grid ats-grid-2">{features.map(([title,text]) => <article key={title} className="ats-card"><h3>{title}</h3><p>{text}</p></article>)}</div>
    <aside className="ats-control-note"><h3>Vos decidís qué se publica y qué se avisa</h3><p>Activar una vacante no la publica: mostrarla en la bolsa pública es una acción aparte. Los avisos por correo a candidatos están apagados por defecto; podés habilitarlos etapa por etapa.</p></aside>
  </div>
</section>;
