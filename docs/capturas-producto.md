# Capturas de producto en la web

Rama `feat/web-capturas-producto`, desde landing/main `bd0bfe7`.
Sustituye la ilustración de tres tarjetas por capturas del componente real
`src/pages/Postulaciones.tsx` de fuente-ats/main `9d1f3a9`.

## Origen y alcance

- Captura local del componente y sus estilos reales, con QueryClient y Router.
  No se recreó el tablero con una ilustración ni se copiaron pantallas de terceros.
- La fixture sustituye hooks de datos, autenticación, prefetch y escritura.
  No contiene SDK, sesión, credenciales ni datos de personas reales.
- Empresa de ejemplo, una vacante «Analista administrativo», siete personas
  ficticias y cuatro etapas configuradas para la demostración. No son las etapas
  predeterminadas ni una promesa de límites del plan.
- Se captura el contenido de Postulaciones sin la barra lateral. No es un
  recorrido E2E autenticado ni una captura tomada de producción.
- Chromium, densidad 2: escritorio a 1440 × 840 y móvil a 390 × 900.
  Toda salida de red externa está bloqueada, incluidas fuentes remotas.
- El código de captura vive en `scripts/product-capture/` y no forma parte
  del build de la web. El build comercial solo utiliza los dos PNG estáticos.

## Presentación

`picture` elige el PNG móvil hasta 640 px y el de escritorio por encima.
Las imágenes declaran dimensiones, tienen texto alternativo y carga diferida.
El aviso aclara que nombres y datos son de demostración.

El botón abre un diálogo nativo con título, descripción y cierre accesible.
Se cierra con Escape, botón o clic en el fondo; el foco vuelve al disparador.
La imagen ampliada conserva un ancho legible, con desplazamiento interno
horizontal/vertical mediante teclado o tacto. No desborda el viewport.

## Regenerar las imágenes

Requiere el checkout local del ATS y sus dependencias instaladas. No usa `.env`
ni hace falta conectar Supabase. El servidor de captura se limita a localhost
(4186); se cierra al terminar y el script rechaza salidas externas del navegador.
No modifica archivos del checkout del ATS.

```sh
npm ci
FUENTE_ATS_SOURCE=/ruta/local/fuente-ats PW_CHROMIUM_PATH=/usr/bin/chromium node scripts/capture-product.mjs
npm run build
npm test
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
git diff --check
```

En esta entrega se usó `/workspace/fuente-ats-condiciones-base`, un checkout
limpio de main del ATS en `9d1f3a9`. Los PNG resultantes están en
`public/producto/`. Antes de actualizarlos, comprobá el commit del ATS y revisá
las dos imágenes: si cambia el componente, también puede cambiar la fixture.

## Verificación local

- Generación: aprobada para ambos tamaños, con datos sintéticos y red externa
  bloqueada. Aviso preexistente de CSS `color-adjust` del ATS.
- Instalación: primer intento bloqueado por EPERM de esbuild dentro del sandbox;
  el reintento con permisos de ejecución aprobó, sin cambios de dependencias.
- Build: aprobado, incluidos los tipos del frontend y del endpoint.
- Vitest: 103 tests, 5 archivos aprobados.
- Navegador: aprobado a 1440 y 390 px, incluyendo recurso seleccionado/cargado,
  visor, foco inicial, Tab/Shift+Tab, desplazamiento, Escape, reapertura con Espacio,
  cierre con botón, foco de retorno y ausencia de desborde. Se mantienen las
  comprobaciones de navegación y formulario con fallo/reintento simulados,
  además del resumen y enlaces disponibles sin JavaScript.
- Una expectativa inicial exigía que Tab desde el último control volviera
  directamente al primero. Chromium permite pasar a la interfaz del navegador
  desde el diálogo nativo; se corrigió el test para verificar el recorrido
  reversible y el retorno de foco al cerrar. No se sustituyó el diálogo ni
  se añadió una trampa de foco propia.
- `git diff --check`: aprobado.

Las evidencias visuales de la landing se generan en `artifacts/producto-390.png`,
`artifacts/producto-1440.png` y sus variantes `-ampliado` (ignoradas por Git).
Para aislar la sección, esas capturas ocultan la cabecera solo al capturar;
no cambian el CSS del sitio ni las pruebas de navegación.

No se enviaron formularios desplegados ni correos reales. No se tocaron
Ats-dev, producción, Edge Functions, migraciones ni el repositorio de la app.
No se modificó la rama de reescritura persuasiva. Sin merge ni despliegue.
