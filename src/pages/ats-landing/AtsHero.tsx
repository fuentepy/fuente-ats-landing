import { APP_LINKS } from "@/lib/links";
const capabilities = [
  ['Pipeline configurable', 'Definí las etapas de tu proceso de selección.'],
  ['Lectura de CVs con IA', 'Una herramienta de apoyo que una persona revisa.'],
  ['Portal de colaboración', 'Con clientes y responsables de contratación.'],
];
export const AtsHero = () => <section id="inicio" className="ats-hero ats-muted-bg">
  <div className="ats-container">
    <div className="ats-hero-copy">
      <span className="ats-eyebrow">Selección para consultoras y equipos de RRHH</span>
      <h1>Gestioná tus búsquedas de selección, <span className="ats-text-gradient">de la solicitud a la contratación</span></h1>
      <p className="ats-lead">FuenteHR, de FUENTEPY S.A., reúne solicitudes, vacantes, candidatos y entrevistas en un solo lugar, con tus clientes o responsables de contratación colaborando en cada proceso.</p>
      <div className="ats-actions"><a className="ats-btn-gradient" href={APP_LINKS.signup}>Comenzar prueba gratuita</a><a className="ats-btn-outline" href="#contacto-ats">Agendar una demo</a></div>
      <p className="ats-note">Prueba gratuita, sin cargos automáticos: solo pasa a plan pago si lo contratás. Al registrarte ves los días y los límites exactos.</p>
      <p>¿Ya tenés cuenta? <a href={APP_LINKS.login}>Iniciar sesión</a></p>
    </div>
    <ul className="ats-capabilities">{capabilities.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ul>
  </div>
</section>;
