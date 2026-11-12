export const AtsShowcase = () => <section id="producto" className="ats-section">
  <div className="ats-container">
    <div className="ats-section-heading"><h2>Seguí el avance de cada búsqueda</h2><p>Un tablero por vacante, con las etapas que configure tu equipo.</p></div>
    <figure className="ats-product-illustration">
      <figcaption>Ilustración con datos de ejemplo</figcaption>
      <div className="ats-example-stages">{['Revisión de perfiles', 'Conversaciones', 'Decisión'].map((stage,i) => <div key={stage}><strong>{stage}</strong><div className="ats-example-profile">Perfil de ejemplo {i+1}<p>Información para revisar</p></div></div>)}</div>
    </figure>
  </div>
</section>;
