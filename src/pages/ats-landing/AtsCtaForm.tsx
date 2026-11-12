import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { APP_LINKS } from '@/lib/links';
import { contactSchema } from '@/lib/contact-schema';
import { TurnstileWidget } from './TurnstileWidget';
const WHATSAPP_URL = `https://wa.me/595994349323?text=${encodeURIComponent('¡Hola! Vi FuenteHR y me gustaría coordinar una demo.')}`;
export const AtsCtaForm = () => {
  const [loading,setLoading] = useState(false);
  const [sent,setSent] = useState(false);
  const [error,setError] = useState('');
  const [token,setToken] = useState('');
  const [captchaVersion,setCaptchaVersion] = useState(0);
  const onToken = useCallback((value:string) => setToken(value),[]);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [form,setForm] = useState({name:'',company:'',email:'',phone:'',team_size:'2-5 reclutadores',work_mode:'',message:'',website:''});
  const field = (key: keyof typeof form) => ({value:form[key],onChange:(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm({...form,[key]:e.target.value})});
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); if(loading)return;
    const parsed = contactSchema.safeParse({...form,turnstile_token:token});
    if(!parsed.success){setError(parsed.error.issues[0]?.message ?? 'Revisá los datos.');return;}
    if(siteKey && !token){setError('Completá la verificación de seguridad.');return;}
    setLoading(true);setError('');
    try {
      const response = await fetch('/api/contact-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data)});
      const data = await response.json().catch(() => null);
      if(!response.ok || !data?.ok) throw new Error('No pudimos enviar tu solicitud. Probá de nuevo más tarde.');
      setSent(true);toast.success('¡Listo! Recibimos tu solicitud. Te contactamos para coordinar un horario.');
    } catch {
      const message='No pudimos enviar tu solicitud. Probá de nuevo más tarde.';
      setError(message);toast.error(message);
    } finally {setLoading(false);setToken('');setCaptchaVersion(v=>v+1);}
  };
  return <section id="contacto-ats" className="ats-section"><div className="ats-container">
    <div className="ats-section-heading"><h2>Agendá una demo</h2><p>Contanos cómo trabajás y coordinamos un recorrido por FuenteHR.</p></div>
    <div className="ats-grid ats-grid-2">
      {sent ? <div className="ats-card" role="status"><h3>¡Solicitud recibida!</h3><p>Te contactamos para coordinar un horario.</p></div> :
      <form onSubmit={handleSubmit} className="ats-contact-form" aria-label="Solicitar una demo">
        <div><label className="ats-label" htmlFor="ats-name">Nombre completo *</label><input id="ats-name" className="ats-input" autoComplete="name" required maxLength={120} {...field('name')} /></div>
        <div><label className="ats-label" htmlFor="ats-company">Empresa *</label><input id="ats-company" className="ats-input" autoComplete="organization" required maxLength={160} {...field('company')} /></div>
        <div><label className="ats-label" htmlFor="ats-email">Correo *</label><input id="ats-email" className="ats-input" type="email" autoComplete="email" required maxLength={200} {...field('email')} /></div>
        <div><label className="ats-label" htmlFor="ats-phone">Teléfono</label><input id="ats-phone" className="ats-input" type="tel" autoComplete="tel" maxLength={40} {...field('phone')} /></div>
        <div><label className="ats-label" htmlFor="ats-team">Tamaño del equipo</label><select id="ats-team" className="ats-select" {...field('team_size')}><option>1 reclutador</option><option>2-5 reclutadores</option><option>6-15 reclutadores</option><option>Más de 15</option></select></div>
        <div><label className="ats-label" htmlFor="ats-mode">¿Cómo trabajan? (opcional)</label><select id="ats-mode" className="ats-select" {...field('work_mode')}><option value="">Sin especificar</option><option value="consultora">Consultora</option><option value="rrhh_interno">Equipo de RRHH interno</option></select></div>
        <div><label className="ats-label" htmlFor="ats-msg">Contanos tu caso (opcional)</label><textarea id="ats-msg" className="ats-textarea" maxLength={1500} {...field('message')} /></div>
        <div className="ats-honeypot" aria-hidden="true"><label htmlFor="ats-website">Sitio web</label><input id="ats-website" name="website" tabIndex={-1} autoComplete="off" {...field('website')} /></div>
        {siteKey && <TurnstileWidget key={captchaVersion} siteKey={siteKey} onToken={onToken} />}
        {error && <p role="alert">{error}</p>}
        <p id="ats-consent" className="ats-note">Usamos estos datos para responder tu consulta. Más información en <a href={APP_LINKS.legal}>Términos y privacidad</a>.</p>
        <button type="submit" className="ats-btn-gradient" aria-describedby="ats-consent" disabled={loading || Boolean(siteKey && !token)}>{loading ? 'Enviando…' : 'Agendar una demo'}</button>
        <p className="ats-note">Te contactamos para coordinar un horario.</p>
      </form>}
      <aside className="ats-card ats-contact-aside"><h3>¿Preferís hablar directo?</h3><p>Escribinos para coordinar una demo.</p><a href={APP_LINKS.contact}>contacto@fuentehr.com</a><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">+595 994 349 323 (WhatsApp)</a><h3>Qué podemos recorrer</h3><ul><li>Vacantes, candidatos y pipeline</li><li>Lectura de CVs con apoyo de IA</li><li>Colaboración con clientes o responsables de contratación</li></ul></aside>
    </div>
  </div></section>;
};
