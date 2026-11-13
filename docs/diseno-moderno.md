# Rediseño visual de la web comercial

Rama `feat/web-diseno-moderno`, desde main `2ac4220`, verificado con fetch.
No se integró ni modificó `feat/web-copy-persuasivo`; sigue separada.

## Resultado

- Portada grafito con el verde de FuenteHR, textura discreta, mensaje breve,
  captura real prioritaria y llamadas a registro/demo. Se mantiene «Sin cargos
  automáticos» y la indicación de días/límites al registrarse, sin inventar valores.
- Cabecera con navegación en superficie clara y acceso directo a iniciar sesión
  también en móvil. Todos los destinos anteriores se conservan.
- Galería inmediatamente después de la portada, antes de las explicaciones.
  Conserva las tres pestañas, sus públicos, pies, alt y recursos oscuros.
- Ampliación de cada captura mediante diálogo nativo: Escape, cierre, foco de
  retorno y desplazamiento con teclado/tacto. Cada apertura reinicia el encuadre;
  esto permite leer en móvil los detalles que quedan pequeños en la miniatura.
- Modalidades en dos tarjetas con beneficios visibles y recorridos completos
  bajo «Ver cómo funciona» (cerrados inicialmente).
- Funciones con icono, frase breve y explicación verificada bajo «Ver detalles».
  Los límites de IA, revisión humana, publicación explícita y avisos apagados por
  defecto siguen presentes. No se promete reclutamiento autónomo.
- Puesta en marcha en tres pasos. Prueba resumida con condiciones completas
  desplegables; el correo empresarial se exige también en el texto visible.
  FAQ y enlaces legales conservados; identidad del proveedor en el pie.
- Formulario más compacto en escritorio mediante CSS. `AtsCtaForm.tsx`, su
  esquema, CAPTCHA, consentimiento, endpoint y lógica de envío no se modificaron.
- Transiciones breves al interactuar; sin animaciones en bucle, vídeos nuevos,
  seguimiento, dependencias ni recursos externos nuevos. Movimiento reducido
  conserva la desactivación de animaciones/transiciones del sitio.

## Texto visible

Comparación de ambos builds locales a 1440×900, con todos los desplegables
cerrados al cargar, usando `document.body.innerText.trim().split(/\s+/).length`:

| Medida | Antes | Rediseño |
| --- | ---: | ---: |
| Palabras visibles en la página | 817 | 592 |
| Palabras visibles en la portada | 108 | 66 |

El build anterior es de `c23d828`, cuyo árbol Git es idéntico al de main `2ac4220`.
Se conserva información ampliada en desplegables; la comparación mide texto
visible inicial, no el contenido total del DOM ni resultados comerciales.

## Verificación ejecutada desde clon limpio

Clon independiente en `/workspace/fuente-ats-landing-moderna-qa`, código `7f16679`,
sin copiar `.env`, node_modules o dist del directorio de desarrollo.

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprobado, salida 0. |
| `npm run build` | Aprobado, salida 0; incluye tipos de app y API. |
| `npm test` | Aprobado, salida 0; 112 tests en 5 archivos. |
| `PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | Aprobado, salida 0. |
| `git diff --check` | Aprobado, salida 0. |

Navegador: recorrido completo a 1440 y 390 px, más portada/navegación a 320,
768 y 1024 px. Sin desbordes. Cubre enlaces, menú, pestañas por clic y teclado,
selección responsive de imágenes, visor, desplazamiento, reinicio del encuadre,
Escape, reapertura con Espacio, foco, desplegables y fallo/reintento del formulario
con API simulada. Sigue pasando el resumen y acceso sin JavaScript.

La suite bloquea la red externa y no envía correos reales. No se tocaron bases,
Vercel ni DNS; no hubo merge ni despliegue manual. No se ejecutó lint porque este
repositorio no tiene script/configuración de ESLint. No se midió conversión real.

Las pruebas de contraste usan tokens CSS reales. Medición adicional ejecutada en
el directorio de desarrollo con `npx vitest run tests/contrast.test.ts --reporter=verbose`:
portada, texto mínimo **8,36:1** (incluye superficies y brillo decorativo al 8%);
botón **12,32:1**. Pestañas, mínimo **5,85:1**. Se mantienen bordes de controles y
foco con contraste mínimo exigido por sus tests.

Fallidas: ninguna. Bloqueadas: ninguna. Pendiente: revisión visual del propietario,
integración y publicación. El visor conserva una imagen estática: no es una demo
interactiva del ATS ni certifica sus flujos autenticados.

## Capturas

Solo se versionan cinco evidencias nuevas; el navegador genera las demás en
`artifacts/` (ignorado por Git). Las capturas del producto originales no cambiaron.

| Vista | Captura |
| --- | --- |
| Portada de escritorio | [Ver](capturas/diseno-moderno/landing-1440-inicio.png) |
| Portada móvil | [Ver](capturas/diseno-moderno/landing-390-inicio.png) |
| Página completa de escritorio | [Ver](capturas/diseno-moderno/landing-1440.png) |
| Página completa móvil | [Ver](capturas/diseno-moderno/landing-390.png) |
| Ampliación en móvil | [Ver](capturas/diseno-moderno/landing-390-captura-ampliada.png) |
