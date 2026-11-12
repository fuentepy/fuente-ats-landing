// Serverless de Vercel: no escribe en la app ni en Supabase.
// Autocontenido: Node ESM no debe resolver módulos relativos sin extensión.
// Mantener paridad con src/lib/contact-schema.ts (cubierta por tests).
import { z } from 'zod';

export const RESPONSE_PROMISE = 'dentro de las próximas 24 horas hábiles';
// No permitir que nombres/empresas incorporen cabeceras o líneas al asunto.
const singleLine = (max: number, label: string) => z.string().max(max)
  .transform(value => value.replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, ' ').trim())
  .pipe(z.string().min(1, `${label} requerido`).max(max));
export const contactSchema = z.object({
  name: singleLine(120, 'Nombre'),
  company: singleLine(160, 'Empresa'),
  email: z.string().trim().email('Ingresá un correo válido').max(200),
  phone: z.string().trim().max(40).optional(),
  team_size: z.enum(['1 reclutador', '2-5 reclutadores', '6-15 reclutadores', 'Más de 15']).optional(),
  work_mode: z.enum(['', 'consultora', 'rrhh_interno']).optional(),
  message: z.string().trim().max(1500).optional(),
  website: z.string().max(200).optional(),
  turnstile_token: z.string().max(2048).optional(),
}).strict();
export type ContactData = z.infer<typeof contactSchema>;

const FROM_NOTIFICATION = 'FuenteHR <noreply@notificaciones.fuentepy.com>';
const FROM_REPLY = 'Equipo FuenteHR <comercial@notificaciones.fuentepy.com>';
const CONTACT_EMAIL = 'contacto@fuentehr.com';
const NOTIFICATION_CC = ['frodriguez@fuentepy.com', 'mdominguez@fuentepy.com'];
const FAILURE = 'No pudimos enviar tu solicitud. Probá de nuevo más tarde.';
interface Request {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}
interface Response {
  setHeader(name: string, value: string): unknown;
  status(code: number): Response;
  json(body: unknown): unknown;
  end(): unknown;
}
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]!);
}
const footer = '<p>FuenteHR / FUENTEPY S.A.</p><p>Recibiste este correo porque solicitaste una demo en fuentehr.com.</p>';
function notificationHtml(data: ContactData) {
  const values = [
    ['Empresa', data.company], ['Contacto', data.name], ['Email', data.email], ['Teléfono', data.phone],
    ['Equipo', data.team_size], ['Modalidad', data.work_mode === 'consultora' ? 'Consultora' : data.work_mode === 'rrhh_interno' ? 'Equipo de RRHH interno' : ''], ['Mensaje', data.message],
  ];
  return `<h1>FuenteHR: nueva solicitud de demo</h1>${values.filter(([,value]) => value).map(([label,value]) => `<p><strong>${label}:</strong> ${escapeHtml(value!).replace(/\n/g, '<br>')}</p>`).join('')}${footer}`;
}
function autoReplyHtml(data: ContactData) {
  const whatsapp = `https://wa.me/595994349323?text=${encodeURIComponent('Hola, solicité una demo de FuenteHR y quiero coordinar un horario.')}`;
  return `<h1>FuenteHR: recibimos tu solicitud</h1><p>Hola ${escapeHtml(data.name)},</p>
    <p>Gracias por tu interés. Recibimos la solicitud de demo de ${escapeHtml(data.company)}.</p>
    <p>Te vamos a contactar ${RESPONSE_PROMISE} para coordinar un horario.</p>
    <p>Podemos recorrer vacantes, candidatos, pipeline y la colaboración con clientes o responsables de contratación.</p>
    <p><a href="${whatsapp}">Escribinos por WhatsApp</a></p><p>Equipo FuenteHR</p>${footer}`;
}
interface Dependencies {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  now?: () => number;
  logger?: Pick<Console, 'error' | 'warn'>;
}
// Cada instancia tiene su propio mapa. No sustituye un límite distribuido ni Turnstile.
export function createContactHandler({ env = process.env, fetchImpl = fetch, now = Date.now, logger = console }: Dependencies = {}) {
  const limits = new Map<string, { count: number; expires: number }>();
  function allowed(keys: { key: string; max: number; duration: number }[]) {
    const time = now();
    for (const [key, value] of limits) if (value.expires <= time) limits.delete(key);
    if (keys.some(({key,max}) => (limits.get(key)?.count ?? 0) >= max)) return false;
    // Cota de memoria: ante saturación se rechaza, no se desalojan límites vigentes.
    if (limits.size + keys.filter(({key}) => !limits.has(key)).length > 10000) return false;
    for (const {key,duration} of keys) {
      const entry = limits.get(key) ?? {count:0,expires:time+duration};
      entry.count++; limits.set(key,entry);
    }
    return true;
  }
  async function sendEmail(payload: Record<string, unknown>) {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.RESEND_API_KEY}`},
      body:JSON.stringify(payload), signal:AbortSignal.timeout(10000),
    });
    // No registrar payloads, claves o datos de contacto. El estado basta para diagnosticar el proveedor.
    if (!response.ok) throw new Error(`Resend respondió HTTP ${response.status}`);
  }
  return async function handler(req: Request, res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method !== 'POST') { res.setHeader('Allow','POST, OPTIONS'); res.status(405).json({ok:false,error:'Método no permitido.'}); return; }
    try {
      let body: unknown;
      try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
      catch { res.status(400).json({ok:false,error:'Revisá los datos del formulario.'}); return; }
      if (body && typeof body === 'object' && 'website' in body && typeof body.website === 'string' && body.website.trim()) {
        res.status(200).json({ok:true}); return;
      }
      const parsed = contactSchema.safeParse(body);
      if (!parsed.success) { res.status(400).json({ok:false,error:'Revisá los datos del formulario.'}); return; }
      const data = parsed.data;
      const forwarded = req.headers['x-forwarded-for'];
      const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
      if (!allowed([{key:`ip:${ip}`,max:5,duration:600000},{key:`email:${data.email.toLowerCase()}`,max:3,duration:3600000}])) {
        res.setHeader('Retry-After','600'); res.status(429).json({ok:false,error:'Recibimos varias solicitudes. Esperá un momento antes de volver a intentar.'}); return;
      }
      if (env.TURNSTILE_SECRET_KEY) {
        if (!data.turnstile_token) { res.status(400).json({ok:false,error:'Completá la verificación de seguridad.'}); return; }
        const verify = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method:'POST', body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:data.turnstile_token}), signal:AbortSignal.timeout(10000),
        });
        const result = await verify.json();
        const host = String(req.headers.host ?? '').split(':')[0];
        if (!verify.ok || result.success !== true || result.action !== 'contact-lead' || !host || result.hostname !== host) {
          res.status(400).json({ok:false,error:'No pudimos validar la verificación de seguridad. Volvé a intentarlo.'}); return;
        }
      } else logger.warn('contact-lead: Turnstile no configurado; protección antiabuso limitada a esta instancia.');
      if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY no configurada');
      await sendEmail({from:FROM_NOTIFICATION,to:[CONTACT_EMAIL],cc:NOTIFICATION_CC,reply_to:data.email,
        subject:`Solicitud de demo FuenteHR — ${data.company}`,html:notificationHtml(data)});
      await sendEmail({from:FROM_REPLY,to:[data.email],reply_to:CONTACT_EMAIL,
        subject:`FuenteHR: te contactamos ${RESPONSE_PROMISE}`,html:autoReplyHtml(data)});
      res.status(200).json({ok:true});
    } catch (error: unknown) {
      logger.error('contact-lead: fallo de envío o verificación', error instanceof Error ? error.message : 'Error desconocido');
      res.status(500).json({ok:false,error:FAILURE});
    }
  };
}
export default createContactHandler();
