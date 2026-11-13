import { useRef } from 'react';
import { Expand, X } from 'lucide-react';

const desktop = '/producto/postulaciones-escritorio.png';
const mobile = '/producto/postulaciones-movil.png';
const description = 'Tablero de Postulaciones de FuenteHR con filtros y candidatos de ejemplo organizados por etapa.';

export const AtsShowcase = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  return <section id="producto" className="ats-section">
    <div className="ats-container">
      <div className="ats-section-heading"><h2>Seguí el avance de cada búsqueda</h2><p>Un tablero de postulaciones por etapa, que podés filtrar por vacante, cliente y estado.</p></div>
      <figure className="ats-product-capture">
        <button type="button" className="ats-product-preview" aria-label="Ampliar captura del tablero de postulaciones" aria-haspopup="dialog" aria-controls="ats-product-dialog" onClick={() => dialog.current?.showModal()}>
          <picture>
            <source media="(max-width: 640px)" srcSet={mobile} width="390" height="900" />
            <img src={desktop} width="1440" height="840" alt={description} loading="lazy" decoding="async" />
          </picture>
          <span className="ats-product-expand" aria-hidden="true"><Expand size={16} /> Ampliar captura</span>
        </button>
        <figcaption>Así se ve FuenteHR. Los nombres y datos son de demostración.</figcaption>
      </figure>
      <dialog ref={dialog} id="ats-product-dialog" className="ats-product-dialog" aria-labelledby="ats-product-dialog-title" aria-describedby="ats-product-dialog-description" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="ats-product-dialog-header">
          <h2 id="ats-product-dialog-title">Tablero de postulaciones</h2>
          <button type="button" className="ats-product-close" aria-label="Cerrar captura" autoFocus onClick={() => dialog.current?.close()}><X size={24} /></button>
        </div>
        <p id="ats-product-dialog-description">Los nombres y datos son de demostración. Podés desplazarte por la captura para ver el tablero completo.</p>
        <div className="ats-product-scroll" tabIndex={0} role="region" aria-label="Captura ampliada del tablero de postulaciones">
          <img src={desktop} width="1440" height="840" alt={description} loading="lazy" decoding="async" />
        </div>
      </dialog>
    </div>
  </section>;
};
