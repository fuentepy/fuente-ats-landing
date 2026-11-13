const stages = ['Solicitud', 'Vacante', 'Selección', 'Contratación'];
export const AtsFlow = () => <section className="ats-flow" aria-label="Recorrido de una búsqueda">
  <div className="ats-container">
    <ol className="ats-flow-track">{stages.map((stage, index) => <li key={stage} style={{ ['--i' as string]: index }}><span>{String(index + 1).padStart(2, '0')}</span>{stage}</li>)}</ol>
    <p className="ats-flow-note">También podés crear la vacante directamente, sin una solicitud previa.</p>
  </div>
</section>;
