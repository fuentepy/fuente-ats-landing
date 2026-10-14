import { useState } from "react";
import { Loader2, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "595994349323"; // 0994 349 323, formato internacional sin '+'
const WHATSAPP_MESSAGE = "¡Hola! Vi la landing del ATS de FuentePy y me gustaría coordinar una demo.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const schema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(120),
  company: z.string().trim().min(1, "Empresa requerida").max(160),
  email: z.string().trim().email("Email inválido").max(200),
  phone: z.string().trim().max(40).optional(),
  team_size: z.string().min(1),
  message: z.string().trim().max(1500).optional(),
});

const includedInDemo = [
  "Recorrido guiado por vacantes, candidatos y pipeline",
  "Cómo se ve la lectura de CVs con IA en vivo",
  "Ejemplo de portal de cliente para tu propia cuenta",
];

export const AtsCtaForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    team_size: "2-5 reclutadores",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
          phone: parsed.data.phone,
          team_size: parsed.data.team_size,
          message: parsed.data.message,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "No pudimos enviar tu solicitud");
      }
      setSent(true);
      toast.success("¡Listo! Te contactamos en menos de 24hs.");
    } catch (err: any) {
      toast.error(err?.message || "Error al enviar. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto-ats" className="ats-section">
      <div className="ats-container">
        <div className="ats-animate-fade-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", marginBottom: "1rem" }}>
            Agendá una <span className="ats-text-gradient">demo sin costo</span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "hsl(var(--ats-muted-fg))", maxWidth: "36rem", margin: "0 auto" }}>
            30 minutos para mostrarte el sistema funcionando con un caso parecido al tuyo.
          </p>
        </div>

        <div className="ats-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", maxWidth: "60rem", margin: "0 auto" }}>
          {sent ? (
            <div className="ats-card ats-animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1rem" }}>
              <CheckCircle2 size={40} color="hsl(var(--ats-primary))" />
              <h3 style={{ fontSize: "1.25rem" }}>¡Solicitud recibida!</h3>
              <p style={{ color: "hsl(var(--ats-muted-fg))" }}>
                Te vamos a escribir a la brevedad para coordinar el mejor horario para tu equipo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ats-animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label className="ats-label" htmlFor="ats-name">Nombre completo *</label>
                <input id="ats-name" className="ats-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} />
              </div>
              <div>
                <label className="ats-label" htmlFor="ats-company">Empresa *</label>
                <input id="ats-company" className="ats-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required maxLength={160} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="ats-label" htmlFor="ats-email">Email *</label>
                  <input id="ats-email" type="email" className="ats-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={200} />
                </div>
                <div>
                  <label className="ats-label" htmlFor="ats-phone">Teléfono</label>
                  <input id="ats-phone" type="tel" className="ats-input" placeholder="+595..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} />
                </div>
              </div>
              <div>
                <label className="ats-label" htmlFor="ats-team">Tamaño de tu equipo de reclutamiento</label>
                <select id="ats-team" className="ats-select" value={form.team_size} onChange={(e) => setForm({ ...form, team_size: e.target.value })}>
                  <option>1 reclutador</option>
                  <option>2-5 reclutadores</option>
                  <option>6-15 reclutadores</option>
                  <option>Más de 15</option>
                </select>
              </div>
              <div>
                <label className="ats-label" htmlFor="ats-msg">Contanos brevemente tu caso (Opcional)</label>
                <textarea id="ats-msg" className="ats-textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1500} placeholder="Cuántas vacantes manejan por mes, qué usan hoy para reclutar..." />
              </div>
              <button type="submit" className="ats-btn-gradient" disabled={loading} style={{ width: "100%" }}>
                {loading ? (<><Loader2 className="ats-spin" size={18} /> Enviando...</>) : "Agendar Demo"}
              </button>
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "hsl(var(--ats-muted-fg))", marginTop: "-0.3rem" }}>
                Sin compromisos. Una charla de 30 minutos para ver si hacemos match.
              </p>
            </form>
          )}

          <div className="ats-animate-fade-up" style={{ animationDelay: "0.15s", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="ats-card">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Qué incluye la demo</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {includedInDemo.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                    <CheckCircle2 size={18} color="hsl(var(--ats-primary))" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <p style={{ fontSize: "0.9rem", color: "hsl(var(--ats-muted-fg))" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, hsl(var(--ats-primary)), hsl(var(--ats-secondary)))", borderRadius: "1rem", padding: "1.5rem", color: "#fff" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem", color: "#fff" }}>¿Preferís hablar directo?</h3>
              <p style={{ opacity: 0.95, marginBottom: "1rem", fontSize: "0.92rem" }}>Escribinos y coordinamos por donde te resulte más cómodo.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <a href="mailto:comercial@fuentepy.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff", textDecoration: "none", fontSize: "0.92rem" }}>
                  <Mail size={16} /> comercial@fuentepy.com
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff", textDecoration: "none", fontSize: "0.92rem" }}>
                  <MessageCircle size={16} /> +595 994 349 323 (WhatsApp)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
