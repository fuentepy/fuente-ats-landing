import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
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
  expect(page).toContain('Ilustración con datos de ejemplo');
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
