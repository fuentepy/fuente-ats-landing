# Mejoras sobre el diseño de Claude y modo claro

Rama `feat/web-tema-y-usabilidad`, desde `feat/web-visual-tecnologica` en
`805d1ba`, verificada con fetch. No se integraron las otras ramas de diseño
ni se reescribió historia. Se conserva la propuesta oscura de Claude.

## Cambios

1. Título breve: «Tu selección, en un solo lugar», en dos líneas equilibradas.
2. Portada con recorte CSS de las tarjetas/etapas reales; la galería conserva
   las capturas completas. No se editaron las nueve imágenes originales.
3. Mayor tamaño de textos secundarios y paletas con contraste medido.
4. Recorrido común: Solicitud → Vacante → Selección → Contratación. Una nota
   aclara que se puede crear la vacante directamente. La propuesta comercial
   sigue explicada como opcional en el recorrido de consultoras.
5. Introducción de modalidades con texto a la izquierda y captura del portal
   a la derecha en escritorio, identificada como consultoras/datos de ejemplo.
6. Formulario con nombre/empresa y correo/teléfono en pares en escritorio.
   Equipo, modalidad y mensaje quedan en «Agregar información (opcional)».
   Consentimiento y CAPTCHA permanecen fuera del plegable. Se puede enviar
   sin abrirlo o con información adicional.
7. Galería ampliable: diálogo nativo, foco, Escape, cierre y desplazamiento
   táctil/teclado. Cada apertura reinicia el encuadre.
8. Login accesible en la cabecera móvil, junto al selector de tema.

## Tema

- Oscuro predeterminado. El botón sol/luna ofrece «Usar modo claro» o
  «Usar modo oscuro» y funciona por teclado. Es un botón de acción con nombre
  de destino; no mezcla ese nombre cambiante con un estado aria-pressed.
- Guarda únicamente `fuentehr-web-theme` tras una elección explícita.
  No escribe una preferencia por defecto, no modifica `fuentepy-theme` del ATS
  y sincroniza las pestañas de la web que comparten origen.
- Logos, formularios, avisos, foco, metadato theme-color y color-scheme nativo
  se adaptan a la elección. Las capturas siguen oscuras: son recursos reales
  del producto, no se invierten ni se generan imágenes claras ficticias.
- `public/web-theme.css` contiene las dos paletas. El CSS y el script clásico
  `public/web-theme-init.js` se cargan en head antes del bundle para pintar
  el tema guardado desde el inicio, sin esperar React.
- Se revisaron index, vercel.json y los archivos del proyecto: no hay una CSP
  configurada que se deba modificar. Son recursos del mismo origen; no se
  añadió código inline ni se debilitó una política.
- Si localStorage está bloqueado, el tema cambia durante la visita pero no
  puede conservarse tras recargar. La página y el formulario siguen funcionando.

## Lógica conservada

Comparación AST contra `805d1ba`: `handleSubmit`, `field`, `onToken`,
`WHATSAPP_URL` y el estado inicial del formulario son idénticos.
Sin cambios en esquema, endpoint, CAPTCHA, límites, destinatarios, dependencia
alguna, datos legales ni las nueve imágenes. Solo cambió la distribución del
formulario. Los tests comprueban su envío con y sin opcionales.

## Verificación final

Desde clon limpio local en `/workspace/fuente-ats-landing-temas-qa`, código
`e89d29f`, sin copiar `.env`, node_modules ni dist del directorio de trabajo:

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprobado, salida 0; 79 paquetes. |
| `npm run build` | Aprobado, salida 0; tipos de app/API y build. |
| `npm test` | Aprobado, salida 0; 121 tests, 6 archivos. |
| `PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | Aprobado, salida 0. |
| `git diff --check` | Aprobado, salida 0. |

Contraste adicional ejecutado con
`npx vitest run tests/contrast.test.ts --reporter=verbose`, usando los tokens
reales y muestreando los degradados: texto mínimo oscuro **7,87:1**, claro
**6,27:1**; botones oscuro **11,02:1**, claro **7,24:1**. Se verifican también
pestañas, texto secundario, error, controles y foco.

Navegador, con red externa bloqueada:
- Recorridos completos a 1440 y 390 px en ambos temas: navegación, logos,
  pestañas por clic/flechas/Inicio/Fin, selección responsive y carga de imágenes,
  ampliación, foco, Escape, opcionales, y error/reintento del formulario simulado.
- Portada y controles sin desbordes a 320, 768 y 1024 px, en ambos temas.
- Persistencia tras recarga, sincronización entre dos pestañas y clave del ATS
  intacta como control positivo.
- Primer fondo correcto con bundle demorado para preferencia clara, oscura,
  ausente e inválida; no hay escrituras predeterminadas.
- Almacenamiento bloqueado, aparición al hacer scroll con movimiento habilitado
  y resumen/enlaces sin JavaScript.

Incidencias del arnés corregidas: Sonner no crea su contenedor hasta que hay
avisos y ese contenedor puede tener altura cero aunque el aviso sea visible;
se verifica la notificación visible. Para abrir dos pestañas compartidas se usa
un contexto explícito de Playwright. Esas corridas iniciales fallaron; la suite
completa final aprobó. Una comparación AST inicial encontró EPERM del sandbox;
se repitió leyendo la fuente base sin crear subprocesos y aprobó.

No se ejecutó ESLint: el repositorio no tiene script/configuración de lint.
No se enviaron correos reales ni formularios desplegados. Sin acceso a bases,
cambios en Vercel/DNS, migraciones, merge ni despliegue manual.
Pendiente: revisión visual, integración y publicación por el propietario.

## Evidencias

Solo se versionan ocho capturas; las demás se generan en artifacts, ignorado.

| Vista | Oscuro | Claro |
| --- | --- | --- |
| Portada escritorio | [Ver](capturas/tema-y-usabilidad/landing-dark-1440-inicio.png) | [Ver](capturas/tema-y-usabilidad/landing-light-1440-inicio.png) |
| Portada móvil | [Ver](capturas/tema-y-usabilidad/landing-dark-390-inicio.png) | [Ver](capturas/tema-y-usabilidad/landing-light-390-inicio.png) |
| Página completa | [Ver](capturas/tema-y-usabilidad/landing-dark-1440.png) | [Ver](capturas/tema-y-usabilidad/landing-light-1440.png) |
| Ampliación móvil | [Ver](capturas/tema-y-usabilidad/zoom-dark-390.png) | [Ver](capturas/tema-y-usabilidad/zoom-light-390.png) |
