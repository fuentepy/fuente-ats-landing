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
      <h1>Tu selección, <span className="ats-text-gradient">en un solo lugar.</span></h1>
      <p className="ats-lead">Gestioná vacantes, candidatos y entrevistas para tu consultora o equipo de RRHH.</p>
      <div className="ats-actions"><a className="ats-btn-gradient" href={APP_LINKS.signup}>Comenzar prueba gratuita <ArrowRight aria-hidden="true" size={18} /></a><a className="ats-btn-outline" href="#contacto-ats">Agendar una demo</a></div>
      <p className="ats-note">Prueba gratuita, sin cargos automáticos. Al registrarte ves los días y los límites exactos.</p>
    </div>
    <figure className="ats-hero-shot" aria-label="Vista previa del tablero de postulaciones">
      <div className="ats-showcase-browser">
        <div className="ats-showcase-browser-bar"><span className="ats-showcase-dots" aria-hidden="true"><i /><i /><i /></span><span>Postulaciones · Datos de ejemplo</span></div>
        <a href="#producto" className="ats-hero-crop" aria-label="Ver las capturas completas de FuenteHR">
          <img src="/capturas/tablero-oscuro-movil-900.webp" width="900" height="617" alt="Recorte del tablero de postulaciones con etapas y tarjetas de candidatos de ejemplo." fetchPriority="high" decoding="async" />
        </a>
      </div>
      <figcaption><a href="#producto">Explorá las capturas completas <ArrowRight size={16} aria-hidden="true" /></a></figcaption>
    </figure>
    <ul className="ats-capabilities">{capabilities.map(([Icon, title, text]) => <li key={title}><Icon aria-hidden="true" size={20} /><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
  </div>
</section>;
