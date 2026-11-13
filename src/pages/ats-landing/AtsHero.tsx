import { ArrowRight, Sparkles, Users, Workflow } from "lucide-react";
import { APP_LINKS } from "@/lib/links";
const capabilities = [
  [Workflow, 'Pipeline configurable', 'Definí las etapas de tu proceso de selección.'],
  [Sparkles, 'Lectura de CVs con IA', 'Una herramienta de apoyo que una persona revisa.'],
  [Users, 'Portal de colaboración', 'Con clientes y responsables de contratación.'],
] as const;
export const AtsHero = () => <section id="inicio" className="ats-hero">
  <div className="ats-hero-glow" aria-hidden="true" />
  <div className="ats-container">
    <div className="ats-hero-copy">
      <span className="ats-eyebrow"><i aria-hidden="true" />Selección para consultoras y equipos de RRHH</span>
      <h1>Gestioná tus búsquedas de selección, <span className="ats-text-gradient">de la solicitud a la contratación</span></h1>
      <p className="ats-lead">Solicitudes, vacantes, candidatos y entrevistas en un solo lugar, con tus clientes o responsables colaborando en cada proceso.</p>
      <div className="ats-actions"><a className="ats-btn-gradient" href={APP_LINKS.signup}>Comenzar prueba gratuita <ArrowRight aria-hidden="true" size={18} /></a><a className="ats-btn-outline" href="#contacto-ats">Agendar una demo</a></div>
      <p className="ats-note">Prueba gratuita, sin cargos automáticos. Al registrarte ves los días y los límites exactos.</p>
      <p className="ats-note">¿Ya tenés cuenta? <a href={APP_LINKS.login}>Iniciar sesión</a></p>
    </div>
    <figure className="ats-hero-shot" aria-label="Vista previa del tablero de postulaciones">
      <div className="ats-showcase-browser">
        <div className="ats-showcase-browser-bar"><span className="ats-showcase-dots" aria-hidden="true"><i /><i /><i /></span><span>app.fuentehr.com · datos de ejemplo</span></div>
        <picture>
          <source media="(max-width: 720px)" srcSet="/capturas/tablero-oscuro-movil-900.webp" width="900" height="617" />
          <img src="/capturas/tablero-oscuro-1600.webp" srcSet="/capturas/tablero-oscuro-800.webp 800w, /capturas/tablero-oscuro-1600.webp 1600w" sizes="(min-width: 1200px) 1100px, (min-width: 721px) 92vw, calc(100vw - 2.5rem)" width="1600" height="914" alt="Vista previa del tablero de postulaciones de FuenteHR con datos de ejemplo." fetchPriority="high" decoding="async" />
        </picture>
      </div>
    </figure>
    <ul className="ats-capabilities">{capabilities.map(([Icon, title, text]) => <li key={title}><Icon aria-hidden="true" size={20} /><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
  </div>
</section>;
