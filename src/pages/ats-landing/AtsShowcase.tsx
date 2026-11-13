import { useRef, useState, type KeyboardEvent } from 'react';
import { Expand, X } from 'lucide-react';

const screens = [
  {
    id: 'tablero', file: 'tablero', label: 'Tablero de postulaciones', audience: 'Consultoras y equipos de RRHH',
    caption: 'Seguí cada postulación por etapa y filtrá por cliente, vacante o estado.',
    alt: 'Tablero de postulaciones de FuenteHR con columnas por etapa (Postulado, Revisión CV, Entrevista y Entrevista Cliente) y tarjetas de candidatos de ejemplo.',
  },
  {
    id: 'portal', file: 'portal-cliente', label: 'Portal del cliente', audience: 'Consultoras',
    caption: 'Tu cliente ve sus vacantes y los perfiles que compartís en cada etapa.',
    alt: 'Vista del portal del cliente con el detalle de una vacante y la lista de postulaciones compartidas, cada una con su etapa.',
  },
  {
    id: 'solicitudes', file: 'solicitudes-rrhh', label: 'Solicitudes de las áreas', audience: 'Equipos de RRHH interno',
    caption: 'RRHH revisa los pedidos de vacante de cada área y decide cuáles aprobar.',
    alt: 'Listado de solicitudes de vacante de las áreas, con puesto, área, urgencia, estado y fecha.',
  },
];

export const AtsShowcase = () => {
  const [active, setActive] = useState(0);
  const viewer = useRef<HTMLDialogElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % screens.length
      : event.key === 'ArrowLeft' ? (index + screens.length - 1) % screens.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? screens.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return <section id="producto" className="ats-section" aria-labelledby="ats-showcase-title">
    <div className="ats-container">
      <div className="ats-section-heading"><h2 id="ats-showcase-title">Seguí el avance de cada búsqueda</h2><p>Capturas con datos de ejemplo</p></div>
      <div className="ats-showcase">
        <div className="ats-showcase-tabs" role="tablist" aria-label="Pantallas de FuenteHR">
          {screens.map((screen, index) => <button
            key={screen.id} ref={element => { tabs.current[index] = element; }}
            type="button" role="tab" id={`ats-tab-${screen.id}`} className="ats-showcase-tab"
            aria-selected={active === index} aria-controls={`ats-panel-${screen.id}`}
            aria-labelledby={`ats-tab-label-${screen.id}`} aria-describedby={`ats-tab-audience-${screen.id}`}
            tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKeyDown(event, index)}
          >
            <span id={`ats-tab-label-${screen.id}`} className="ats-showcase-tab-label">{screen.label}</span>
            <span id={`ats-tab-audience-${screen.id}`} className="ats-showcase-tab-audience">{screen.audience}</span>
          </button>)}
        </div>
        {screens.map((screen, index) => <div
          key={screen.id} role="tabpanel" id={`ats-panel-${screen.id}`} aria-labelledby={`ats-tab-${screen.id}`}
          className="ats-showcase-panel" hidden={active !== index} tabIndex={0}
        >
          <figure>
            <div className="ats-showcase-browser">
              <div className="ats-showcase-browser-bar">
                <span className="ats-showcase-dots" aria-hidden="true"><i /><i /><i /></span>
                <span>Capturas con datos de ejemplo</span>
              </div>
              <button type="button" className="ats-capture-open" aria-label={`Ampliar captura: ${screen.label}`} aria-haspopup="dialog" aria-controls="ats-capture-dialog" onClick={() => viewer.current?.showModal()}>
              <picture>
                <source media="(max-width: 720px)" srcSet={`/capturas/${screen.file}-oscuro-movil-900.webp`} width="900" height="617" />
                <img src={`/capturas/${screen.file}-oscuro-1600.webp`}
                  srcSet={`/capturas/${screen.file}-oscuro-800.webp 800w, /capturas/${screen.file}-oscuro-1600.webp 1600w`}
                  sizes="(min-width: 1200px) 1100px, (min-width: 721px) 92vw, calc(100vw - 2.5rem)"
                  width="1600" height="914" alt={screen.alt} loading="lazy" decoding="async" />
              </picture>
              <span className="ats-capture-expand" aria-hidden="true"><Expand size={16} /> Ampliar</span>
              </button>
            </div>
            <figcaption>{screen.caption}</figcaption>
          </figure>
        </div>)}
        <dialog ref={viewer} id="ats-capture-dialog" className="ats-capture-dialog" aria-labelledby="ats-capture-title" aria-describedby="ats-capture-description" onClick={event => { if (event.target === event.currentTarget) viewer.current?.close(); }}>
          <div className="ats-capture-dialog-heading"><h2 id="ats-capture-title">{screens[active].label}</h2><button type="button" className="ats-capture-close" aria-label="Cerrar captura" autoFocus onClick={() => viewer.current?.close()}><X size={23} aria-hidden="true" /></button></div>
          <p id="ats-capture-description">Capturas con datos de ejemplo. Desplazate por la imagen para ver los detalles.</p>
          <div className="ats-capture-scroll" role="region" aria-label="Captura ampliada" tabIndex={0}><img src={`/capturas/${screens[active].file}-oscuro-1600.webp`} width="1600" height="914" alt={screens[active].alt} loading="lazy" decoding="async" /></div>
        </dialog>
      </div>
    </div>
  </section>;
};
