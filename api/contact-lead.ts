// Endpoint serverless de Vercel para el formulario de la landing del ATS.
// Independiente de Supabase a propósito: la landing se despliega en Vercel y este
// endpoint se despliega junto con ella en cada push, sin depender de un deploy
// manual de Edge Functions. Por ahora NO escribe en el CRM (se carga a mano desde
// el email); si en el futuro se quiere automatizar esa carga, agregarla acá.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_NOTIFICATION = "FuentePy ATS <noreply@notificaciones.fuentepy.com>";
const FROM_REPLY = "Equipo Comercial · FuentePy <comercial@notificaciones.fuentepy.com>";
const SALES_EMAIL = "comercial@fuentepy.com";
const NOTIFICATION_CC = ["frodriguez@fuentepy.com", "mdominguez@fuentepy.com"];

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

function notificationHtml(data: {
  name: string; company: string; email: string; phone?: string; team_size?: string; message?: string;
}) {
  const { name, company, email, phone, team_size, message } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #12261A; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">FUENTEPY ATS</h1>
        <p style="color: #93C01F; margin: 5px 0 0 0; font-size: 14px;">Nuevo lead desde la landing</p>
      </div>
      <div style="padding: 30px 20px; background-color: #ffffff;">
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
          <p style="margin: 0 0 8px 0;"><strong>Empresa:</strong> ${escapeHtml(company)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Contacto:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p style="margin: 0 0 8px 0;"><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ""}
          ${team_size ? `<p style="margin: 0 0 8px 0;"><strong>Tamaño del equipo:</strong> ${escapeHtml(team_size)}</p>` : ""}
          ${message ? `<p style="margin: 8px 0 0 0;"><strong>Mensaje:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : ""}
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">Cargar manualmente en el CRM cuando corresponda.</p>
      </div>
    </div>
  `;
}

function autoReplyHtml(data: { name: string; company: string }) {
  const { name, company } = data;
  const firstName = escapeHtml(name).split(" ")[0] || escapeHtml(name);
  const whatsappMessage = encodeURIComponent(
    `Hola, soy ${name} de ${company}. Completé el formulario de demo del ATS en la web.`
  );
  const whatsappUrl = `https://wa.me/595994349323?text=${whatsappMessage}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #39A935, #93C01F); padding: 32px 24px; text-align: center;">
        <p style="color: #ffffff; margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.9;">FuentePy ATS</p>
        <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 22px; font-weight: 700;">¡Recibimos tu solicitud!</h1>
      </div>

      <div style="padding: 32px 28px;">
        <p style="font-size: 16px; color: #12261A; margin: 0 0 16px 0;">Hola ${firstName},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">
          Gracias por tu interés en FuentePy ATS. Ya recibimos la solicitud de demo de
          <strong>${escapeHtml(company)}</strong> y nuestro equipo comercial la está revisando.
        </p>

        <div style="background-color: #ecfdf5; border-left: 4px solid #39A935; border-radius: 6px; padding: 14px 18px; margin: 0 0 24px 0;">
          <p style="margin: 0; font-size: 15px; color: #065f46;">
            ⏱️ <strong>Te vamos a contactar en menos de 24 horas hábiles</strong> para coordinar el mejor horario.
          </p>
        </div>

        <p style="font-size: 14px; font-weight: 700; color: #12261A; margin: 0 0 12px 0;">En la demo vas a ver:</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 24px 0;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #374151; vertical-align: top;">✅&nbsp;&nbsp;Recorrido guiado por vacantes, candidatos y pipeline</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #374151; vertical-align: top;">✅&nbsp;&nbsp;Cómo se ve la lectura de CVs con IA en vivo</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #374151; vertical-align: top;">✅&nbsp;&nbsp;Un ejemplo de portal de cliente armado para tu propia cuenta</td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #374151; margin: 0 0 8px 0;">¿Preferís adelantar la charla?</p>
        <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #39A935, #93C01F); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 22px; border-radius: 8px; margin-bottom: 8px;">
          Escribinos por WhatsApp
        </a>

        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 28px 0 0 0;">
          Saludos,<br/>
          <strong>Equipo Comercial de FuentePy</strong>
        </p>
      </div>

      <div style="padding: 18px 24px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">FuentePy S.A. — Software de Reclutamiento con IA</p>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 11px;">
          Recibiste este correo porque solicitaste una demo en nuestra landing page.
        </p>
      </div>
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const { name, company, email, phone, team_size, message } = body;

    if (!name || !company || !email) {
      res.status(400).json({ ok: false, error: "Faltan campos obligatorios (nombre, empresa, email)" });
      return;
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY no configurada en Vercel");
      res.status(500).json({ ok: false, error: "Servicio de email no configurado" });
      return;
    }

    await sendEmail({
      from: FROM_NOTIFICATION,
      to: [SALES_EMAIL],
      cc: NOTIFICATION_CC,
      reply_to: email,
      subject: `Nuevo lead — ${company}`,
      html: notificationHtml({ name, company, email, phone, team_size, message }),
    });

    await sendEmail({
      from: FROM_REPLY,
      to: [email],
      reply_to: SALES_EMAIL,
      subject: "Recibimos tu solicitud — te contactamos en menos de 24hs",
      html: autoReplyHtml({ name, company }),
    });

    res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("contact-lead error:", error);
    res.status(500).json({ ok: false, error: error?.message || "Error al procesar la solicitud" });
  }
}
