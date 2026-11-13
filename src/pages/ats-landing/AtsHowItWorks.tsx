const steps = [
  ['Creá tu empresa', 'Usá un correo de empresa y confirmá tu correo para comenzar.'],
  ['Elegí cómo trabajás', 'Seleccioná consultora o RRHH interno y seguí la guía de puesta en marcha.'],
  ['Iniciá tu primera búsqueda', 'Creá tu primera vacante y sumá a tu equipo y a tus clientes o áreas. El administrador crea las cuentas del equipo.'],
];
export const AtsHowItWorks = () => <section id="como-empezar" className="ats-section ats-muted-bg"><div className="ats-container">
  <div className="ats-section-heading"><span className="ats-eyebrow">En marcha</span><h2>Cómo empezar</h2></div>
  <ol className="ats-start-steps">{steps.map(([title,text], index) => <li key={title} className="ats-reveal"><span className="ats-step-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
</div></section>;
