const stages = ['Solicitud', 'Propuesta', 'Vacante', 'Selección', 'Cliente', 'Contratación'];
export const AtsFlow = () => <section className="ats-flow" aria-label="Recorrido de una búsqueda">
  <div className="ats-container">
    <ol className="ats-flow-track">{stages.map((stage, index) => <li key={stage} style={{ ['--i' as string]: index }}><span>{String(index + 1).padStart(2, '0')}</span>{stage}</li>)}</ol>
  </div>
</section>;
