# Corrección urgente: arranque ESM y textos factuales

Base: main 56788f6. Rama fix/endpoint-y-textos-verificados, independiente de la
reescritura persuasiva. No se modificó esa otra rama, ni se hizo merge/despliegue.

## Evidencia antes y después

La misma prueba `node scripts/test-handler-startup.mjs` se ejecutó antes y después
del arreglo. Compila con tsc a un directorio temporal, marca el paquete como ESM,
instala un enlace a las dependencias del proyecto e importa el JavaScript emitido
con un proceso Node nativo. No usa un loader de Vitest/Vite para resolver imports.
Las peticiones del probe son exclusivamente OPTIONS y GET y fetch está bloqueado.
El directorio temporal se elimina al terminar.

- [Antes](arranque-antes.txt): código de salida 1, ERR_MODULE_NOT_FOUND al importar
  src/lib/contact-schema sin extensión. Se reprodujo sobre el handler de 56788f6.
- [Después](arranque-despues.txt): código de salida 0, OPTIONS 204, GET 405 con
  JSON y ambos sin CORS permisivo. Node 24.19.0 en este entorno.

Esto **confirma un defecto local de arranque en Node ESM**, coherente con la
hipótesis del incidente. No reproduce el compilador/empaquetado exacto de Vercel
ni acredita por sí solo la causa del FUNCTION_INVOCATION_FAILED desplegado. Sin
los logs de esa invocación no se afirma una causa confirmada del 500 en producción.
El resultado del preview, si se puede descubrir y consultar, se informa por
separado en la entrega; una respuesta de protección no verifica el handler.

## Alcance y regresiones

El endpoint importa solo zod como dependencia de paquete; no usa imports relativos.
La validación y la promesa de respuesta se conservaron localmente, sin cambios de
semántica. src/lib/contact-schema.ts permanece intacto para el formulario.

Las pruebas de paridad cubren éxito/rechazo, valores transformados y errores para
nombre/empresa/correo, límites exactos y excedidos, teléfono, mensaje, honeypot,
token, campos extra, tipos incorrectos y todos los valores de ambos selectores.
También comparan la promesa y prohíben imports relativos estáticos/dinámicos.

La suite anterior del handler sigue probando validación, honeypot, Turnstile con
y sin secreto, cuotas, destinatarios/CC, errores genéricos, CORS y autorespuesta
solo después de los controles. Todos los proveedores se simulan. npm test incluye
ahora la prueba de arranque nativo; no depende de que alguien la recuerde ejecutar.

Los cambios de texto son exclusivamente los pedidos: pipeline general de la
empresa, tablero filtrable, Organización → Crear Usuario para dueño/admin y
restricciones tras el período de gracia en los dos bloques de prueba. No hay
reescritura persuasiva ni cambios de diseño.

## Reproducir desde un clon limpio

```sh
npm ci
npm run build
npm test
node scripts/test-handler-startup.mjs
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
git diff --check
```

El navegador usa solo localhost, bloquea red externa y simula /api. No envía leads.
No hacen falta claves reales de Resend ni Turnstile. Para un preview desplegado,
solo consultar OPTIONS/GET; nunca enviar POST para esta verificación.
