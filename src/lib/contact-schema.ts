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
