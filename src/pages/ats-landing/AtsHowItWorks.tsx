import { Building2, SlidersHorizontal, Search } from 'lucide-react';
const steps = [
  { icon: Building2, title: 'Creá tu empresa', text: 'Usá un correo de empresa y confirmá tu correo para comenzar.' },
  { icon: SlidersHorizontal, title: 'Elegí cómo trabajás', text: 'Seleccioná consultora o RRHH interno y seguí la guía de puesta en marcha.' },
  { icon: Search, title: 'Iniciá tu primera búsqueda', text: 'Creá tu primera vacante y sumá a tu equipo y a tus clientes o áreas. El administrador crea las cuentas del equipo.' },
];
export const AtsHowItWorks = () => <section id="como-empezar" className="ats-section ats-muted-bg"><div className="ats-container">
  <div className="ats-section-heading"><span className="ats-eyebrow">La puesta en marcha</span><h2>Empezá por tu primera búsqueda.</h2></div>
  <ol className="ats-start-steps">{steps.map((step,index) => <li key={step.title}><div className="ats-step-heading"><span className="ats-step-number">0{index + 1}</span><step.icon size={23} aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
</div></section>;
