import { APP_LINKS } from '@/lib/links';
const questions = [
  ['¿Cómo se usan los datos y la IA?', <>Los datos se usan para gestionar tus procesos de selección según los <a href={APP_LINKS.legal}>Términos y privacidad</a>. Al solicitar un análisis de CV con IA, su contenido puede enviarse a un proveedor externo. La IA puede dar resultados incompletos: una persona debe revisar y decidir.</>],
  ['¿Qué pasa cuando termina la prueba?', 'No se convierte automáticamente en una suscripción paga ni autoriza cargos. Para continuar con un plan pago tenés que contratarlo expresamente. Al vencer se restringe crear vacantes, sumar personal y usar IA, tras el período de gracia aplicable. Tus datos se conservan.'],
  ['¿Las vacantes se publican solas?', 'No. Activar y publicar son acciones separadas. Podés mantener una búsqueda activa sin mostrarla en la bolsa pública.'],
  ['¿Se envían avisos a los candidatos?', 'Por defecto están apagados. El dueño o administrador puede habilitarlos por etapa.'],
  ['¿Puedo usar FuenteHR sin un equipo?', 'Sí. Podés empezar gestionando tus búsquedas y sumar personas después.'],
  ['¿Cómo sumo a mi equipo?', 'El dueño o administrador crea las cuentas desde Organización → Crear Usuario. Los contactos de clientes se crean desde la ficha del cliente.'],
];
export const AtsTrialAndFaq = () => <>
  <section id="prueba-gratuita" className="ats-section"><div className="ats-container ats-trial">
    <span className="ats-eyebrow">Tu próximo proceso empieza acá</span><h2>Probá FuenteHR con tu empresa</h2>
    <p className="ats-trial-lead">Sin cargos automáticos. Contratás un plan pago solo si lo decidís.</p>
    <p className="ats-note">Necesitás un correo de empresa. Los días y límites vigentes se informan al registrarte.</p>
    <details className="ats-trial-detail"><summary>Ver condiciones de la prueba</summary>
      <p>La prueba gratuita no se convierte automáticamente en una suscripción paga ni autoriza cargos. La continuidad paga requiere contratación expresa.</p>
      <p>Al vencer se restringe crear vacantes, sumar personal y usar IA, tras el período de gracia aplicable. Tus datos se conservan. En el registro ves los días y los límites vigentes.</p>
      <p>Necesitás un correo de empresa: no se aceptan Gmail, Hotmail, Yahoo ni otros correos personales similares.</p>
    </details>
    <div className="ats-actions"><a href={APP_LINKS.signup} className="ats-btn-gradient">Comenzar prueba gratuita</a><a href={APP_LINKS.legal}>Términos y privacidad</a></div>
  </div></section>
  <section id="preguntas" className="ats-section ats-muted-bg"><div className="ats-container ats-faq">
    <h2>Preguntas frecuentes</h2>{questions.map(([question,answer]) => <details key={String(question)}><summary>{question}</summary><p>{answer}</p></details>)}
  </div></section>
</>;
