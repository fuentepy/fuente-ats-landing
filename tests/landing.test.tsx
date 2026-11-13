import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { AtsShowcase } from '../src/pages/ats-landing/AtsShowcase';
import { it, expect, vi, afterEach } from 'vitest';
import AtsLandingPage from '../src/pages/ats-landing/AtsLandingPage';
const html = () => renderToStaticMarkup(<AtsLandingPage />);
afterEach(()=>vi.unstubAllEnvs());
it('acciones principales y acceso a la app usan destinos reales',()=>{
  const page=html();
  expect(page).toMatch(/href="https:\/\/app.fuentehr.com\/auth\/signup">Comenzar prueba gratuita/);
  expect(page).toMatch(/href="#contacto-ats">Agendar una demo/);
  expect(page).toMatch(/href="https:\/\/app.fuentehr.com\/auth\/login">Iniciar sesión/);
  expect(page).toContain('>Crear empresa</a>');expect(page).toContain('>Saltar al contenido</a>');
});
it('navegación, anclas y pie son enlaces reales y legales',()=>{
  const page=html();
  for(const id of ['modalidades','funciones','como-empezar','contacto-ats']){expect(page).toContain(`href="#${id}"`);expect(page).toContain(`id="${id}"`);}
  expect(page).toContain('FuenteHR es un producto de FUENTEPY S.A.');
  expect(page).toMatch(/<footer[\s\S]*href="https:\/\/app.fuentehr.com\/terminos"/);
  expect(page).toMatch(/<footer[\s\S]*href="mailto:contacto@fuentehr.com"/);
  expect(page).not.toMatch(/<button[^>]*>Modalidades/);
});
it('consentimiento junto al envío, honeypot sin foco y modalidad opcional',()=>{
  const page=html();expect(page).toContain('Usamos estos datos para responder tu consulta. Más información en');
  expect(page).toContain('aria-describedby="ats-consent"');expect(page).toContain('aria-hidden="true"');expect(page).toMatch(/name="website" tabindex="-1"/);
  expect(page).toContain('¿Cómo trabajan? (opcional)');expect(page).toContain('dentro de las próximas 24 horas hábiles');
});
it('Turnstile solo se incluye si está configurado',()=>{
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY','');expect(html()).not.toContain('Verificación de seguridad');
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY','synthetic-site-key');expect(html()).toContain('Verificación de seguridad');
});
it('no conserva afirmaciones retiradas ni puntajes o nombres ficticios de personas',()=>{
  const page=html();
  for(const text of ['70%','100% Seguros','Alta Disponibilidad','solo lectura','4 etapas','FuentePy','comercial@fuentepy.com','app.tuempresa.com','85%','Lucía Benítez'])expect(page).not.toContain(text);
  expect(page).toContain('Capturas con datos de ejemplo');
  expect(page).not.toContain('Ilustración con datos de ejemplo');
  expect(page).not.toContain('Perfil de ejemplo');
});
it('explica control, dos modalidades, condiciones e IA revisada por personas',()=>{
  const page=html();for(const text of ['Consultora de selección','Equipo de RRHH interno','Propuesta comercial, cuando corresponde','antes de la vacante','RRHH crea la vacante en borrador','RRHH los confirma','Activar una vacante no la publica','apagados por defecto','una persona debe revisar y decidir','proveedor externo','correo de empresa','contratación expresa'])expect(page).toContain(text);
});
it('metadatos estáticos son la única fuente de verdad y el canónico usa www',()=>{
  const index=readFileSync('index.html','utf8');const runtime=readFileSync('src/pages/ats-landing/AtsLandingPage.tsx','utf8');
  expect(index).toContain('lang="es"');expect(index).toContain('<title>FuenteHR');expect(index).toContain('href="https://www.fuentehr.com/"');
  const descriptions=[...index.matchAll(/<meta (?:name="(?:description|twitter:description)"|property="og:description") content="([^"]+)"/g)].map(m=>m[1]);
  expect(descriptions).toHaveLength(3);expect(new Set(descriptions).size).toBe(1);expect(descriptions[0].length).toBeLessThanOrEqual(160);
  expect(runtime).not.toMatch(/document\.title|setAttribute\(/);
  expect(index).toContain('<noscript>');expect(index).not.toContain('user-scalable=no');
  for(const file of ['public/robots.txt','public/sitemap.xml'])expect(readFileSync(file,'utf8')).toContain('https://www.fuentehr.com/');
});

it('corrige pipeline general, acceso a usuarios y período de gracia en ambos textos',()=>{
  const page=html();
  const hero=page.match(/<section id="inicio"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  const features=page.match(/<section id="funciones"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  expect(hero).toContain('Definí las etapas de tu proceso de selección');
  expect(features).toContain('Pipeline configurable');
  expect(features).toContain('Definí las etapas de tu empresa y seguí el avance de las postulaciones de todas tus vacantes.');
  expect(`${hero} ${features}`).not.toContain('por vacante');
  expect(page).not.toContain('Un tablero por vacante');
  expect(page).toContain('Seguí cada postulación por etapa y filtrá por cliente, vacante o estado.');
  expect(page).not.toContain('Configuración → Usuarios');
  expect(page).toContain('El dueño o administrador crea las cuentas desde Organización → Crear Usuario.');
  const grace='Al vencer se restringe crear vacantes, sumar personal y usar IA, tras el período de gracia aplicable. Tus datos se conservan.';
  expect(page.split(grace)).toHaveLength(3);
});

const showcaseHtml = () => renderToStaticMarkup(<AtsShowcase />);
const showcaseScreens = [
  ['tablero', 'Tablero de postulaciones', 'Consultoras y equipos de RRHH', 'Seguí cada postulación por etapa y filtrá por cliente, vacante o estado.'],
  ['portal', 'Portal del cliente', 'Consultoras', 'Tu cliente ve sus vacantes y los perfiles que compartís en cada etapa.'],
  ['solicitudes', 'Solicitudes de las áreas', 'Equipos de RRHH interno', 'RRHH revisa los pedidos de vacante de cada área y decide cuáles aprobar.'],
];
it('showcase tiene tres pestañas enlazadas a tres paneles, dos ocultos', () => {
  const page = showcaseHtml();
  expect(page.match(/role="tablist"/g)).toHaveLength(1);
  expect(page.match(/role="tab"/g)).toHaveLength(3);
  expect(page.match(/role="tabpanel"/g)).toHaveLength(3);
  expect(page.match(/ hidden=""/g)).toHaveLength(2);
  showcaseScreens.forEach(([id, label, audience, caption], index) => {
    const tab = page.match(new RegExp(`<button[^>]*id="ats-tab-${id}"[^>]*>`))?.[0] ?? '';
    expect(tab).toContain(`aria-selected="${index === 0}"`);
    expect(tab).toContain(`aria-controls="ats-panel-${id}"`);
    expect(tab).toContain(`tabindex="${index === 0 ? 0 : -1}"`);
    expect(page).toContain(`id="ats-panel-${id}" aria-labelledby="ats-tab-${id}"`);
    expect(page).toContain(label); expect(page).toContain(audience); expect(page).toContain(caption);
  });
});
it('showcase usa pictures móviles con dimensiones, alt verificado y rótulo visible en cada marco', () => {
  const page = showcaseHtml();
  expect(page.match(/<picture>/g)).toHaveLength(3);
  expect(page.match(/Capturas con datos de ejemplo/g)).toHaveLength(5);
  const images = page.match(/<img\b[^>]*>/g) ?? [];
  expect(images).toHaveLength(4);
  for (const img of images) {
    expect(img).toContain('width="1600"'); expect(img).toContain('height="914"');
    expect(img).toContain('loading="lazy"'); expect(img).toContain('decoding="async"');
  }
  expect(page).toContain('alt="Tablero de postulaciones de FuenteHR con columnas por etapa (Postulado, Revisión CV, Entrevista y Entrevista Cliente) y tarjetas de candidatos de ejemplo."');
  expect(page).toContain('alt="Vista del portal del cliente con el detalle de una vacante y la lista de postulaciones compartidas, cada una con su etapa."');
  expect(page).toContain('alt="Listado de solicitudes de vacante de las áreas, con puesto, área, urgencia, estado y fecha."');
  const sources = page.match(/<source\b[^>]*>/g) ?? [];
  expect(sources).toHaveLength(3);
  for (const source of sources) {
    expect(source).toContain('(max-width: 720px)'); expect(source).toContain('width="900"'); expect(source).toContain('height="617"');
  }
  expect(page).not.toMatch(/Perfil de ejemplo|Ilustración con datos de ejemplo|ats-example-/);
  expect(readFileSync('src/pages/ats-landing/styles.css', 'utf8')).not.toContain('ats-example-');
});
// Medición real del encabezado WebP sin herramientas nativas ni dependencias nuevas.
function webpSize(bytes: Buffer): [number, number] {
  expect(bytes.toString('ascii', 0, 4)).toBe('RIFF'); expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString('ascii', offset, offset + 4), start = offset + 8;
    if (kind === 'VP8X') return [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
    if (kind === 'VP8 ') return [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
    if (kind === 'VP8L') {
      const packed = bytes.readUInt32LE(start + 1);
      return [(packed & 0x3fff) + 1, ((packed >>> 14) & 0x3fff) + 1];
    }
    const size = bytes.readUInt32LE(offset + 4); offset = start + size + (size % 2);
  }
  throw new Error('Encabezado WebP sin dimensiones');
}
it('las nueve imágenes existen, pesan menos de 120 kB y tienen las dimensiones usadas', () => {
  const files = readdirSync('public/capturas').filter(file => file.endsWith('.webp'));
  expect(files).toHaveLength(9);
  for (const name of files) {
    const file = `public/capturas/${name}`;
    expect(statSync(file).size).toBeLessThanOrEqual(120_000);
    const expected = name.includes('-movil-') ? [900, 617] : name.includes('-1600') ? [1600, 914] : [800, 457];
    expect(webpSize(readFileSync(file))).toEqual(expected);
  }
});
it('todos los srcset del showcase apuntan a los nueve archivos locales existentes', () => {
  const sets = [...showcaseHtml().matchAll(/srcset="([^"]+)"/gi)];
  expect(sets).toHaveLength(6);
  const files = new Set<string>();
  for (const [, set] of sets) for (const entry of set.split(',')) {
    const url = entry.trim().split(/\s+/)[0];
    expect(url).toMatch(/^\/capturas\/[a-z0-9-]+\.webp$/);
    expect(existsSync(`public${url}`)).toBe(true); files.add(url);
  }
  expect(files.size).toBe(9);
});

it('título breve, recorrido común correcto y acceso al modo claro', () => {
  const page=html();
  expect(page).toContain('Tu selección,');expect(page).toContain('en un solo lugar.');
  const flow=page.match(/<section[^>]*aria-label="Recorrido de una búsqueda"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  expect(flow).not.toContain('Propuesta');expect(flow).not.toContain('Cliente');
  for(const stage of ['Solicitud','Vacante','Selección','Contratación'])expect(flow).toContain(stage);
  expect(flow).toContain('sin una solicitud previa');
  expect(page).toContain('aria-label="Usar modo claro"');expect(page).toContain('aria-pressed="false"');
  expect(page).toContain('class="ats-header-login"');
});
it('datos opcionales plegados sin ocultar campos requeridos, CAPTCHA o consentimiento', () => {
  const page=html();const form=page.match(/<form[\s\S]*?<\/form>/)?.[0] ?? '';
  const optional=form.match(/<details class="ats-form-extra">([\s\S]*?)<\/details>/)?.[1] ?? '';
  for(const id of ['ats-team','ats-mode','ats-msg'])expect(optional).toContain(`id="${id}"`);
  for(const id of ['ats-name','ats-company','ats-email','ats-phone','ats-consent'])expect(optional).not.toContain(`id="${id}"`);
  expect(optional).not.toContain('required=""');
  expect(form).toContain('Agregar información (opcional)');
  expect(form).not.toMatch(/<details[^>]* open/);
});
it('el recorte de portada y el visor mantienen datos de ejemplo y acceso a capturas completas', () => {
  const page=html();expect(page).toContain('class="ats-hero-crop"');
  expect(page).toContain('Ver las capturas completas de FuenteHR');
  expect(page).toContain('aria-label="Cerrar captura"');expect(page).toContain('aria-label="Captura ampliada"');
  expect(page).toContain('Portal del cliente · Consultoras · Datos de ejemplo');
});
