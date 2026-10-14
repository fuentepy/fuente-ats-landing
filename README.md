# fuente-ats-landing

Landing de ventas del ATS de FuentePy, servida en la raíz de **https://fuentehr.com**.
Extraída de `fuentepy/fuente-candidatos` (`src/pages/public/ats-landing`). Es una página única
(Vite + React + TypeScript) con CSS propio; no usa Supabase, router ni la app.

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # typecheck + build a dist/
```

## Formulario de contacto

`src/pages/ats-landing/AtsCtaForm.tsx` hace `POST /api/contact-lead`, una función serverless de
Vercel (`api/contact-lead.ts`) que envía los emails con Resend. Variable de entorno requerida:

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de Resend. El dominio `notificaciones.fuentepy.com` debe estar verificado ahí. |

Remitentes y destinatarios están fijos en `api/contact-lead.ts`. En local, `npm run dev` no sirve
`/api`; usar `vercel dev` para probar el formulario.

## Deploy (Vercel)

1. Importar este repo en Vercel (framework Vite, se detecta solo).
2. Definir `RESEND_API_KEY` en Project Settings > Environment Variables.
3. Settings > Domains: agregar `fuentehr.com` y configurar el DNS que indique Vercel.
