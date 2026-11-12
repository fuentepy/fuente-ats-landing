const features = [
  ['Tus clientes participan en el proceso', 'Desde su portal, comentan los perfiles compartidos, proponen horarios, evalúan entrevistas y piden nuevos perfiles. También pueden responder propuestas comerciales y descartar candidatos con motivo.'],
  ['Vos decidís qué se publica y qué se avisa', 'Activar una vacante no la publica. Los avisos a candidatos están apagados por defecto y podés habilitarlos por etapa.'],
  ['La IA ayuda, vos decidís', 'Usá la lectura de CVs como apoyo. Puede dar resultados incompletos: una persona debe revisar y decidir.'],
  ['Tu proceso, con tus etapas', 'Configurá el pipeline de selección para toda tu empresa y seguí el avance de las postulaciones.'],
];
export const AtsFeatures = () => <section id="funciones" className="ats-section ats-muted-bg">
  <div className="ats-container">
    <div className="ats-section-heading"><span className="ats-eyebrow">El control queda en tu equipo</span><h2>De cada perfil a una decisión compartida</h2></div>
    <div className="ats-grid ats-grid-2">{features.map(([title,text]) => <article key={title} className="ats-card"><h3>{title}</h3><p>{text}</p></article>)}</div>
    <aside className="ats-control-note"><h3>Vos decidís qué se publica y qué se avisa</h3><p>Activar una vacante no la publica: mostrarla en la bolsa pública es una acción aparte. Los avisos por correo a candidatos están apagados por defecto; podés habilitarlos etapa por etapa.</p></aside>
  </div>
</section>;
