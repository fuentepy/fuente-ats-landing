# Web comercial FuenteHR — etapa 1

## Alcance y decisiones

Trabajo en `feat/web-fuentehr-etapa-1` desde `origin/main` **0f3c305**, verificado
por fetch. Hechos contrastados en lectura con `fuente-ats/origin/main` **c91f40e**:
`docs/modo-rrhh-interno.md`, `docs/publicacion-de-vacantes.md`, etiquetas de modalidad
y ayuda del portal del cliente. Los demás hechos y condiciones comerciales se
mantienen conforme a las decisiones expresas del pedido.

- FuenteHR como marca principal; FUENTEPY S.A. en el pie y los correos. Logos
  transparentes de 600×200 tomados de la app y optimizados (~38/40 KiB).
- Registro de empresa como acción principal, demo como secundaria; login visible
  en escritorio y menú móvil. Destinos absolutos de la app, sin modificarla.
- Recorridos separados: propuesta comercial antes de la vacante y opcional al
  crearla directamente; aprobación de RRHH crea borrador en modo interno;
  responsables proponen horarios y RRHH confirma. Portal de colaboración,
  publicación explícita y avisos por etapa, sin cifras ni garantías inventadas.
- Prueba sin días ni límites fijos en la web; sin conversión ni cargos automáticos.
  Correo de empresa requerido para registrar. Las FAQ explican conservación de
  datos y restricciones al vencer, sin prometer un plazo de retención indefinido.
- IA como apoyo con revisión humana y posible envío a proveedor externo. La
  ilustración está identificada como ejemplo, sin personas ni porcentajes.
- Metadatos solo en `index.html`, sin reescritura React. Tests evitan divergencias
  de descripciones. Canónico, OG, robots y sitemap usan `https://www.fuentehr.com/`.
- No se incorporaron cookies propias ni analítica. Se conservan las fuentes de
  Google existentes; Turnstile es una integración externa opcional solicitada.
- Formulario/servidor comparten esquema estricto y promesa de respuesta. Honeypot,
  límites en memoria y Turnstile opcional preceden a ambos correos. Sin CORS abierto,
  con errores genéricos y logs acotados sin payload ni claves. No hay persistencia
  de leads ni escritura en otra aplicación. Detalles en README.

No se modificaron app, bases de datos, Edge Functions, migraciones, Vercel ni DNS.
No se envió el formulario de ningún sitio desplegado. No se ejecutó un deploy ni
un merge; cualquier preview automático del proveedor no fue configurado ni probado.

## Open Graph

`public/og-image.jpg`: **1200×630**, nueva imagen FuenteHR (~45 KiB), generada y
revisada visualmente. Plantilla `scripts/og-template.html`, comando reproducible:

```sh
PW_CHROMIUM_PATH=/usr/bin/chromium npm run generate:og
```

El primer intento con `page.goto(file://...)` falló por una política de Chromium
(`ERR_BLOCKED_BY_ADMINISTRATOR`). Se corrigió en un commit adicional de marca:
ahora se lee la plantilla y se embebe el logo con `page.setContent`, sin red.
La generación posterior pasó. No queda bloqueada ni pendiente la imagen.

## Verificación ejecutada

| Verificación | Resultado y alcance |
| --- | --- |
| `npm run build` | Aprobado: tipos frontend y endpoint en modo estricto, y Vite build. |
| `npm test` | 47 pruebas aprobadas en 3 archivos; handler con fetch inyectado y red global prohibida, UI SSR y contraste. |
| Contraste con tokens CSS reales | Botón mínimo 7,24:1 con texto blanco; título mínimo 6,84:1 sobre fondo. Texto de cuerpo ≥4,5:1 y bordes de controles ≥3:1. Gradiente muestreado en 101 puntos sRGB. |
| `PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | Aprobado en 1440 y 390 px: enlaces, anclas, no desborde, menú móvil, Enter/Espacio/Escape, foco y salto al contenido. Formulario con error y reintento exitoso simulados en ambas medidas; resumen sin JavaScript. |
| Capturas | Revisadas la página móvil, inicio móvil/escritorio y OG. El script las deja en artifacts/, fuera de Git. |
| `git diff --check` | Aprobado. |

Los tests del handler cubren obligatoriedad/formato/largos/campos extra, saneado
y escape, honeypot sin envíos, ausencia de CORS, errores genéricos, destinatarios,
CC y reply-to, orden de los dos correos, fallo parcial, Turnstile con y sin secreto,
token inválido/ausente, host/acción incorrectos, fallo de red y ventanas de límites.
Los tests SSR cubren acciones y destinos, consentimiento, enlaces legales,
modalidades, textos retirados, widget condicionado a clave y metadatos.

El navegador solo visitó localhost: todas las salidas externas (incluidas fuentes)
se bloquearon y `/api/contact-lead` fue simulado. Esto es una prueba de interfaz
local; **no es un E2E de registro en la app, una validación de Resend/Cloudflare
real ni una certificación completa de accesibilidad**. No se usaron datos reales.

Fallido y corregido: primer render de OG por file URL. No quedan verificaciones
locales fallidas ni bloqueadas. Pendientes: integración real de Turnstile/Resend
por el propietario, navegadores distintos de Chromium y dispositivos físicos.
No se hizo una prueba de formulario en Vercel, por restricción expresa del pedido.

## Variables y tareas del propietario

1. Mantener `RESEND_API_KEY` solo en servidor. No cambia el dominio de envío
   `notificaciones.fuentepy.com`, por lo que no se solicita otra verificación
   Resend. Confirmar que `contacto@fuentehr.com` recibe correo. Se mantienen los CC.
2. Opcional: crear `TURNSTILE_SECRET_KEY` (servidor) y
   `VITE_TURNSTILE_SITE_KEY` (pública de build) juntas. Registrar los hosts deseados
   en Cloudflare Turnstile, incluyendo previews autorizados si se quieren usar.
   No hace falta cambiar el proveedor DNS. La acción esperada es `contact-lead`.
   Solo una clave configurada deja una configuración incompleta, detallada en README.
3. Las variables VITE requieren nuevo build. No se cambiaron variables ni se
   comprobó su estado real en Vercel. El propietario decide integración y despliegue.

Sin Turnstile el servidor advierte y sigue con protección por instancia. Esos
contadores no son globales, se reinician en frío y no sustituyen un control
antiabuso distribuido. No se promete frenar todo abuso. Una autorespuesta puede
llegar a una dirección escrita por un tercero: no se verifica su titularidad.
Si falla el segundo envío después de notificar, un reintento puede duplicar el
lead; no se agregó cola ni idempotencia. No se garantiza entrega de correo.

## Textos pendientes de revisión y preguntas abiertas

- **Revisión legal pendiente:** «Usamos estos datos para responder tu consulta.
  Más información en Términos y privacidad». Confirmar que la política de la app
  también describe los datos de consultas comerciales, Resend, Turnstile cuando
  se active, finalidades, conservación y ejercicio de derechos. Es texto de
  información junto al envío; no implica aprobación legal ni suscripción a marketing.
- **Confirmación operativa:** poder sostener la promesa acordada de respuesta
  «dentro de las próximas 24 horas hábiles». Está unificada, no verificada como SLA.
- **Canónico:** se usa www como se pidió. ¿Se desea conservarlo a largo plazo?
  Cambiar a dominio raíz requiere decidirlo y alinear Vercel, no solo metadatos.
- **Antiabuso:** decidir cuándo activar Turnstile y cuáles previews registrar.
  No hace falta responder para revisar esta rama; sí configurarlo para validarlo.
- Capturas reales y página de planes quedan para la segunda etapa, junto con
  cualquier precio, blog, prerender u otro idioma. No se prometen On-Premise,
  migración de procesos, SLA ni certificaciones.

## Reproducción

```sh
npm ci
npm run build
npm test
npx vitest run tests/contrast.test.ts --reporter=verbose --silent=false
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
PW_CHROMIUM_PATH=/usr/bin/chromium npm run generate:og
git diff --check
```
