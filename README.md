# FuenteHR — web comercial

Web de ventas de **FuenteHR, un producto de FUENTEPY S.A.**, en
**https://www.fuentehr.com/**. Vite, React y TypeScript, con una función serverless
Vercel en `api/contact-lead.ts`. No depende de la base de datos ni modifica la app.

## Desarrollo y verificación local

Requiere Node.js 22.12+ (o 24) y npm. `package-lock.json` fija las dependencias.

```sh
npm ci
npm run dev                 # http://localhost:8080, solo frontend
npm run build               # tipos del frontend Y endpoint + dist/
npm test                    # Vitest: Resend y Turnstile simulados, sin envíos reales
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
PW_CHROMIUM_PATH=/usr/bin/chromium npm run generate:og
git diff --check
```

`test:browser` necesita un build previo, levanta y cierra Vite preview en
`127.0.0.1:4178`, bloquea toda red externa y simula `/api/contact-lead`. Recorre
1440 y 390 px, enlaces, anclas, teclado/menú, no desborde y fallo/reintento de
formulario. También comprueba el resumen sin JavaScript. Las capturas quedan en
`artifacts/` (ignorado por Git). No prueba la entrega real de correos.

### Elegir Chromium para `test:browser`

`PW_CHROMIUM_PATH` es una variable local de las herramientas de prueba: indica
la ruta al ejecutable de Chromium y se pasa a Playwright como `executablePath`.
No es una variable de Vercel ni se incorpora al sitio. Si ya tenés Chromium del
sistema, usá su ruta real, por ejemplo:

```sh
npm run build
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

Sin esa variable, Playwright busca **su propia versión de Chromium** en su caché.
Tener otra versión instalada (del sistema o de otro Playwright) no alcanza y
puede producir `Executable doesn't exist`. Para usar el navegador administrado
por la versión de Playwright de este proyecto:

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

La instalación del navegador requiere red; el **test es 100% local**: solo abre
localhost, bloquea la red externa y simula `/api/contact-lead`, sin enviar correos
ni tocar sitios desplegados. No requiere claves de Resend ni Turnstile.

`generate:og` también admite `PW_CHROMIUM_PATH`. Usa una plantilla HTML local y
el logo embebido: no depende de recursos externos ni de URLs `file://`.

**No envíes formularios de despliegues para probar**: incluso un preview podría
tener una clave real de Resend. Vite dev/preview no ejecuta funciones `/api`;
para probar el handler usá `npm test`. No necesitás claves reales para los tests.

## Variables de entorno (Vercel)

| Variable | Uso | Requisito |
| --- | --- | --- |
| `RESEND_API_KEY` | Solo servidor; enviar notificación y autorespuesta con Resend | Ya existente, necesaria para envíos reales. Nunca usar prefijo `VITE_`. |
| `TURNSTILE_SECRET_KEY` | Solo servidor; verificar tokens con Cloudflare | Nueva, opcional. Si se configura, exige token válido. |
| `VITE_TURNSTILE_SITE_KEY` | Clave pública del widget en el build del frontend | Nueva, opcional. Debe corresponder al secreto. |

Configurá **las dos claves Turnstile juntas** o dejá ambas ausentes. Solo secreto
bloquea el envío porque no hay widget; solo clave pública no activa la validación
del servidor. El widget usa la acción `contact-lead`; el servidor exige esa
acción y que el hostname informado por Cloudflare coincida con el host de la
petición. Registrar los hosts autorizados en Cloudflare Turnstile (www y cualquier
preview que se quiera habilitar) no requiere cambiar DNS ni trasladar el dominio.
Las variables `VITE_` se incorporan al build: un cambio requiere un nuevo build.

Sin secreto se omite Turnstile con una advertencia de servidor. Quedan activos
honeypot y límites en memoria, **insuficientes como protección distribuida**.
La activación y verificación real de Turnstile queda a cargo del propietario;
no se configuraron Vercel, Cloudflare, DNS ni secretos en esta entrega.

## Comportamiento del endpoint

- Solo POST; OPTIONS devuelve 204 sin CORS permisivo. No es una API para otros
  orígenes. Errores genéricos al navegador, diagnóstico acotado en servidor sin
  registrar datos del formulario ni claves.
- Esquema zod compartido con el formulario, campos extra rechazados. Nombre
  hasta 120 caracteres, empresa 160, correo válido 200, teléfono 40 y mensaje
  1500. Equipo y modalidad limitados a las opciones del formulario. Nombre y
  empresa se convierten a una línea y el HTML se escapa.
- Campo trampa `website` lleno: 200 `{ok:true}` sin verificar ni enviar correos.
- Mejores esfuerzos por instancia: 5 intentos por IP cada 10 minutos y 3 por
  correo cada hora (incluye intentos válidos que después fallen en la verificación
  o el envío). Mapa acotado, con expiración; 429 al exceder límites. La IP se toma
  de `x-forwarded-for` que Vercel administra, con fallback al socket.
- **Vercel no comparte la memoria entre instancias y un arranque en frío reinicia
  el contador**. Turnstile es el control principal ante abuso; no se promete que
  estos contadores sean un límite global. En otro proxy hay que validar la fuente
  de IP; no confiar en cabeceras controladas por el cliente.
- Tras todos los controles, envía primero la notificación a
  `contacto@fuentehr.com`, manteniendo `NOTIFICATION_CC`. Solo si esa operación
  termina correctamente envía la respuesta al correo escrito en el formulario.
  La autorespuesta no verifica que la persona controle esa dirección.
- Remitentes visibles `FuenteHR` y `Equipo FuenteHR`, manteniendo
  `notificaciones.fuentepy.com` como dominio de envío verificado. Reply-to de la
  autorespuesta: `contacto@fuentehr.com`. No hace falta otro dominio Resend para
  este cambio; verificar que el buzón de contacto exista y reciba las consultas.
- Promesa compartida: «dentro de las próximas 24 horas hábiles».
- Las llamadas a proveedores tienen timeout de 10 segundos. Si la notificación
  fue enviada y falla la autorespuesta, la petición devuelve error; un reintento
  podría duplicar la notificación. No se agregó cola ni idempotencia distribuida.

## Marca y SEO

Los metadatos editables viven en `index.html`; el componente ya no los reescribe.
Los tests comprueban igualdad de descripciones y el límite de 160 caracteres.
Canónico, Open Graph, robots y sitemap usan **www**, conforme al host indicado.
`public/og-image.jpg` es 1200×630, generado por `scripts/render-og.mjs` desde
`scripts/og-template.html`. Los logos se tomaron de `fuente-ats/main` y se redujeron
a 600×200 con transparencia (~38/40 KiB). El texto comercial usa voseo.

No se agregaron cookies, analítica ni seguimiento. Se conservan las fuentes de
Google preexistentes; el script de Cloudflare solo se carga si se configura su
clave pública. Las pruebas de navegador bloquean también esas salidas y usan
fuentes de respaldo del sistema.

## Publicación y pendientes

Los pushes a esta rama son para revisión: **no se integra main ni se despliega**
como parte de la tarea. El propietario administra cualquier preview automático
y el merge a main (que publica la web). No se cambió `vercel.json`, DNS ni dominios.

Ver [decisiones y validación de la etapa 1](docs/web-fuentehr-etapa-1.md), incluyendo
revisión legal pendiente, condiciones de prueba y límites de lo ejecutado.

## Reescritura comercial

La [tabla de respaldo de afirmaciones](docs/respaldo-de-afirmaciones.md) documenta
la evidencia del producto, los textos descartados, las preguntas pendientes y la
validación local de la reescritura AIDA. Incluye capturas de la primera pantalla
y la historia ilustrativa en 1440 y 390 px. No se atribuyen resultados comerciales
medidos ni se presentan casos de clientes.
