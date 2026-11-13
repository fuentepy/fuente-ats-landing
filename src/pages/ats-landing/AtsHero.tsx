import { ArrowDown, ArrowRight, Check, GitBranch, Sparkles } from 'lucide-react';
import { APP_LINKS } from '@/lib/links';

export const AtsHero = () => <section id="inicio" className="ats-hero">
  <div className="ats-container">
    <div className="ats-hero-grid">
      <div className="ats-hero-copy">
        <span className="ats-eyebrow"><span className="ats-status-dot" aria-hidden="true" /> Para consultoras y equipos de RRHH</span>
        <h1>Tu selección,<br /><span>en un solo lugar.</span></h1>
        <p className="ats-lead">Organizá vacantes, candidatos y entrevistas. Colaborá con tus clientes o con las áreas de tu empresa.</p>
        <div className="ats-actions"><a className="ats-btn-gradient" href={APP_LINKS.signup}>Comenzar prueba gratuita <ArrowRight size={18} aria-hidden="true" /></a><a className="ats-btn-outline" href="#contacto-ats">Agendar una demo</a></div>
        <p className="ats-note"><Check size={15} aria-hidden="true" /> Sin cargos automáticos. Días y límites al registrarte.</p>
      </div>
      <div className="ats-hero-product">
        <div className="ats-hero-product-heading"><span><GitBranch size={16} aria-hidden="true" /> Tu proceso, conectado</span><span className="ats-product-live-label">Vista de ejemplo</span></div>
        <a href="#producto" className="ats-hero-preview" aria-label="Ver las capturas de FuenteHR">
          <picture>
            <source media="(max-width: 720px)" srcSet="/capturas/tablero-oscuro-movil-900.webp" width="900" height="617" />
            <img src="/capturas/tablero-oscuro-1600.webp" srcSet="/capturas/tablero-oscuro-800.webp 800w, /capturas/tablero-oscuro-1600.webp 1600w" sizes="(min-width: 1100px) 650px, (min-width: 721px) 85vw, calc(100vw - 2.5rem)" width="1600" height="914" alt="Vista de FuenteHR con postulaciones organizadas por etapa y datos de ejemplo." fetchPriority="high" decoding="async" />
          </picture>
        </a>
        <div className="ats-hero-product-caption"><span><Sparkles size={15} aria-hidden="true" /> Lectura de CVs con apoyo de IA</span><a href="#producto">Explorá el producto <ArrowDown size={15} aria-hidden="true" /></a></div>
      </div>
    </div>
    <div className="ats-process-strip" aria-label="Recorrido de selección">
      <span>De principio a fin</span>
      <ol>{['Solicitud', 'Vacante', 'Selección', 'Contratación'].map(step => <li key={step}><Check size={15} aria-hidden="true" />{step}</li>)}</ol>
    </div>
  </div>
</section>;
