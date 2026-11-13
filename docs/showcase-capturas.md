# Sección de producto con capturas

Rama `feat/web-showcase-capturas`. Se verificaron por fetch la cabeza inicial
`02bd5ad` y main `bd0bfe7`. No se modificaron las nueve imágenes suministradas.

- Una captura oscura por vez, con tres pestañas en el orden solicitado y sus
  públicos. Los tres paneles permanecen en el DOM; dos tienen `hidden`.
- Roles ARIA, etiquetas y relaciones tab/panel, foco visible y un único tab
  en el orden de tabulación. Flechas izquierda/derecha activan y enfocan,
  con vuelta circular; Inicio/Fin van a los extremos. Tab lleva al panel.
- Marco CSS con barra, tres puntos, borde, esquinas y sombra; máximo 1100 px.
- `picture` carga el recorte móvil hasta 720 px. Por encima elige entre 800 y
  1600 mediante srcset/sizes. Dimensiones explícitas, lazy y decoding async.
- Título conservado; subtítulo y rótulo del marco: «Capturas con datos de ejemplo».
  Pies y alt son los pedidos. Se eliminó la maqueta y todo `ats-example-*`.
  No cambiaron otras secciones, formulario, endpoint ni diseño base.

## Recursos medidos

Todas las pantallas comparten estas dimensiones, **sin diferencias** respecto
al pedido: escritorio 1600×914, alternativa 800×457 y móvil 900×617.
Los nueve WebP pesan entre 16.050 y 64.264 bytes; ninguno supera 120.000 bytes.
Total: 287.226 bytes. Los tests verifican archivos, dimensiones del encabezado
WebP y todos los destinos de srcset sin dependencias nuevas.

## Pruebas ejecutadas

Desde un clon limpio local de la rama en `6fd4935`, sin copiar `.env`, node_modules
ni dist del directorio de trabajo:

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprobado, salida 0; 79 paquetes instalados. |
| `npm run build` | Aprobado, salida 0; incluye tipos de app y API. |
| `npm test` | Aprobado, salida 0; 108 tests, 5 archivos. |
| `PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | Aprobado, salida 0; 1440/390 px y resumen sin JavaScript. |
| `npx vitest run tests/contrast.test.ts --reporter=verbose` | Aprobado, salida 0; tres tests y mediciones numéricas. |
| `git diff --check` | Aprobado, salida 0. |

Navegador: clic en las tres pestañas, flechas en ambos sentidos incluyendo vuelta
circular, Inicio/Fin, foco y Tab al panel; tres paneles presentes y ocultamiento
correcto; imagen activa decodificada y naturalWidth > 0. En los tres paneles,
390 px selecciona el archivo móvil y 1440 px el de 1600. Sin desborde horizontal;
los enlaces y el recorrido previo de menú/formulario simulado siguen pasando.
Toda la red externa está bloqueada. No se envió nada a una URL desplegada.

Contraste de texto de pestañas con los tokens y reglas CSS reales: normal
18,09:1; público 6,20:1; hover 17,06:1 / 5,85:1; activa y su público 7,24:1.
Mínimo **5,85:1**, mayor que 4,5:1.

Fallidas: ninguna. Bloqueadas: ninguna. Pendiente: integración y publicación
por el propietario; no se hicieron como parte de esta entrega.
No se tocaron Vercel, DNS ni `feat/web-copy-persuasivo`. El conflicto futuro
con esa rama sigue fuera de alcance.

## Revisión visual y capturas

En 390 px se ven las tres pestañas y sus públicos sin ocultar opciones ni crear
scroll horizontal. El recorte sin barra lateral aprovecha el ancho, pero el texto
interno de las tablas sigue pequeño al reducir 900 px a unos 350 px: sirve como
vista general, no para leer cada dato. Si se busca esa lectura, se propone para
otra entrega un visor ampliado o capturas de detalle; no se agregó ahora.

| Pantalla | 1440 px | 390 px |
| --- | --- | --- |
| Tablero | [Ver](capturas/showcase/showcase-1440-tablero.png) | [Ver](capturas/showcase/showcase-390-tablero.png) |
| Portal | [Ver](capturas/showcase/showcase-1440-portal.png) | [Ver](capturas/showcase/showcase-390-portal.png) |
| Solicitudes | [Ver](capturas/showcase/showcase-1440-solicitudes.png) | [Ver](capturas/showcase/showcase-390-solicitudes.png) |

Solo se versionan esas seis evidencias (748.361 bytes). El test las regenera en
`artifacts/`, ignorado por Git. Para aislar la sección, oculta la cabecera únicamente
durante cada captura; no cambia la presentación ni la navegación del producto.
