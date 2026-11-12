# Respaldo de afirmaciones — reescritura comercial

Base de la web: `fuente-ats-landing/main` **56788f6**. Evidencia del producto:
[`fuentepy/fuente-ats/main`, c91f40e](https://github.com/fuentepy/fuente-ats/tree/c91f40e).
Los archivos de la tercera columna pertenecen a ese repositorio y revisión, no a
la landing. Se revisaron por lectura de Git: no se probaron contra la app ni una
base remota. Describir una capacidad no garantiza que esté incluida en todo plan
ni reemplaza las restricciones por rol, asignación o etapa.

La indicación posterior del usuario fue trabajar sobre los últimos commits:
se tomó el main disponible, sin esperar una corrección adicional del endpoint.
No se modificó `api/`, el esquema compartido, la app, el CSS, la configuración de
Vercel, DNS ni la estructura u orden de secciones. Las historias y las acciones
se incorporaron dentro de las secciones existentes.

## Tabla de respaldo

Las frases que reaparecen se respaldan por el mismo hecho; se incluyen sus
variantes en la fila correspondiente. Los títulos puramente editoriales, las
preguntas y el dolor descrito no representan resultados medidos ni testimonios.

| Texto de la web | Hecho que lo respalda | Archivo de fuentepy/fuente-ats donde se verifica |
| --- | --- | --- |
| «Selección para consultoras y equipos de RRHH»; «Consultora de selección»; «Equipo de RRHH interno» | Existen las modalidades consultora y rrhh_interno. | `docs/modo-rrhh-interno.md`; `src/lib/tenant-type-labels.ts` |
| «FuenteHR reúne solicitudes, vacantes, candidatos y entrevistas en un solo lugar, y deja que tus clientes o responsables de contratación participen en cada proceso.» | La app incorpora esos módulos; la colaboración exige procesos asignados y visibilidad según modalidad y etapa. No promete exposición a todos los usuarios. | `src/App.tsx`; `docs/modo-rrhh-interno.md`; `src/components/help/ClientHelpContent.tsx` |
| «Pipeline configurable»; «Configurá las etapas de selección de tu empresa.»; «Tu proceso, con tus etapas»; «Configurá el pipeline de selección para toda tu empresa y seguí el avance de las postulaciones.» | Configuración administra las etapas generales sin jobId. Al crear una etapa se inyecta tenant_id y no job_id. Las postulaciones se vinculan a etapas. La columna histórica job_id no se vende como configuración independiente de cada vacante. | `src/components/pipeline/PipelineConfiguration.tsx`; `src/components/pipeline/PipelineStageForm.tsx`; `src/hooks/usePipelineStages.ts`; `src/repositories/pipelineStages.repository.ts`; `src/repositories/applications.repository.ts` |
| «Lectura de CVs con IA»; «Una herramienta de apoyo que una persona revisa.»; «La IA ayuda, vos decidís»; «Usá la lectura de CVs como apoyo. Puede dar resultados incompletos: una persona debe revisar y decidir.» | Las herramientas de extracción y evaluación pueden producir información incompleta o incorrecta; los términos exigen supervisión humana. No se promete precisión ni idoneidad. | `supabase/migrations/20261029100000_company_legal_documents.sql` (§6); `docs/analisis-ia-permisos-y-primer-analisis.md` |
| «Portal de colaboración»; «Con clientes y responsables de contratación.» | Portal de clientes y participación de responsables en procesos asignados, con alcances distintos. | `src/components/help/ClientHelpContent.tsx`; `docs/modo-rrhh-interno.md` |
| «Prueba gratuita, sin cargos automáticos: solo pasa a plan pago si lo contratás. Al registrarte ves los días y los límites exactos.» | El alta muestra configuración vigente de duración/funciones/límites. La contratación paga es expresa. No se replica una duración en la web. La app advierte que las condiciones disponibles pueden cambiar antes del alta si se agota una campaña. | `src/components/auth/SignupTrialConditions.tsx`; `docs/alta-autonoma.md`; `supabase/migrations/20261029100000_company_legal_documents.sql` (§4) |
| «Clientes en un mismo lugar»; «Solicitudes de nuevos perfiles»; «Propuestas comerciales antes de la vacante»; «Portal para colaborar con cada cliente» | Módulo de clientes, solicitudes, aceptación de propuestas y conversión a vacante. Las propuestas no son un paso de cierre de la contratación. | `src/App.tsx`; `src/components/help/ClientHelpContent.tsx`; `docs/modo-rrhh-interno.md` |
| «Áreas con sus propios responsables»; «Responsables de contratación asignados por proceso»; «Búsquedas activas sin publicación pública»; «Perfiles compartidos por etapa» | Áreas y membresías internas; asignación de proceso y shared_with_hm para ver postulaciones; publicación separada de estado activo. | `docs/modo-rrhh-interno.md`; `docs/publicacion-de-vacantes.md` |
| «Un cliente te pide un perfil y lo registrás como solicitud. Si corresponde, le presentás una propuesta comercial antes de la vacante. Con la propuesta aceptada, o directamente, creás la vacante.» | El cliente puede solicitar un perfil y responder la propuesta; existe el recorrido de propuesta aceptada a vacante y también la creación directa de vacantes. Es un ejemplo de uso, no una obligación de usar propuestas. | `src/components/help/ClientHelpContent.tsx`; `docs/modo-rrhh-interno.md`; `src/pages/vacantes/NuevaVacante.tsx` |
| «Organizás la búsqueda y decidís si la publicás. Revisás perfiles y avanzás por las etapas del proceso.» | El estado de la vacante y su publicación son independientes; las postulaciones avanzan por etapas. | `docs/publicacion-de-vacantes.md`; `src/repositories/applications.repository.ts` |
| «Compartís perfiles con el cliente por etapa. Desde su portal, comenta, propone horarios y evalúa entrevistas. Al final, registrás la contratación.» | El portal muestra postulaciones según etapas visibles; permite comentarios, propuestas de horario y evaluación. Una etapa is_hired registra contratación para reportes. El ejemplo no asegura que toda búsqueda termine en contratación. | `src/components/help/ClientHelpContent.tsx`; `src/components/pipeline/PipelineStageForm.tsx`; `src/repositories/pipelineStages.repository.ts` |
| «Recibís la solicitud de un área que necesita cubrir un puesto. Desde RRHH revisás la solicitud y, al aprobarla, creás la vacante en borrador.» | approve_internal_job_request crea la vacante en borrador y asigna al solicitante. | `docs/modo-rrhh-interno.md` |
| «Mantenés la búsqueda activa sin publicarla si es interna. Revisás los candidatos y avanzás por las etapas.» | Puede existir una vacante activa sin published_at; la selección y el avance interno no requieren publicar. No se promete confidencialidad frente a todo el personal de la empresa. | `docs/publicacion-de-vacantes.md`; `src/repositories/applications.repository.ts` |
| «El responsable asignado ve los perfiles de las etapas compartidas y propone horarios de entrevista. Desde RRHH los confirmás. Reunís las evaluaciones y registrás la decisión.» | Visibilidad por asignación y etapa compartida; propuesta de horarios por responsable y confirmación por RRHH. La colaboración comprende evaluación y comentarios de los perfiles autorizados. | `docs/modo-rrhh-interno.md`; `src/data/manualReclutador.ts` |
| «Tus clientes participan en el proceso»; «Desde su portal, comentan los perfiles compartidos, proponen horarios, evalúan entrevistas y piden nuevos perfiles. También pueden responder propuestas comerciales y descartar candidatos con motivo.» | Acciones expresamente descritas en el portal: comentar, organizar entrevista, evaluar, solicitar perfiles, responder propuesta y descartar. | `src/components/help/ClientHelpContent.tsx` |
| «Vos decidís qué se publica y qué se avisa»; «Activar una vacante no la publica. Los avisos a candidatos están apagados por defecto y podés habilitarlos por etapa.» | Publicación explícita; indicadores y configuración por etapa, sin habilitación automática de avisos. La decisión corresponde a los roles autorizados. | `docs/publicacion-de-vacantes.md`; `docs/avisos-pipeline.md`; `src/components/pipeline/PipelineStageForm.tsx` |
| «Activar una vacante no la publica: mostrarla en la bolsa pública es una acción aparte. Los avisos por correo a candidatos están apagados por defecto; podés habilitarlos etapa por etapa.» | Mismo control de publicación y flags de notificación. No se promete entrega garantizada de los correos. | `docs/publicacion-de-vacantes.md`; `docs/avisos-pipeline.md` |
| «Seguí el avance de cada búsqueda»; «Seguí las postulaciones de cada búsqueda con las etapas que configure tu empresa.» | Las postulaciones tienen etapa; se consultan para el proceso y usan las etapas generales disponibles. | `src/repositories/applications.repository.ts`; `src/hooks/usePipelineStages.ts`; `src/components/pipeline/PipelineConfiguration.tsx` |
| «Creá tu empresa»; «Usá un correo de empresa y confirmá tu correo para comenzar.»; «Usá un correo de empresa para registrarte.» | Alta de organización y confirmación de correo. Se orienta a usar correo empresarial; el bloqueo de dominios gratuitos depende de block_free_domains y no se afirma que esté siempre activo. | `src/pages/auth/Signup.tsx`; `src/components/auth/SignupEmailConfirmation.tsx`; `src/lib/free-email-domains.ts` |
| «Elegí cómo trabajás»; «Seleccioná consultora o RRHH interno y seguí la guía de puesta en marcha.» | La bienvenida permite al propietario confirmar modalidad; la guía usa datos reales de empresa. | `docs/onboarding-autogestion.md`; `src/components/onboarding/ModeWelcome.tsx`; `src/components/onboarding/OnboardingChecklist.tsx` |
| «Iniciá tu primera búsqueda»; «Creá tu primera vacante y sumá a tu equipo y a tus clientes o áreas. El administrador crea las cuentas del equipo.» | La guía enlaza creación de vacante y clientes/áreas; el alta administrativa crea cuentas. No se promete una invitación por enlace. | `docs/usabilidad-puesta-en-marcha.md`; `src/components/organization/UserManagementDialog.tsx`; `src/components/clients/ClientUserForm.tsx` |
| «La prueba gratuita no se convierte automáticamente en una suscripción paga ni autoriza cargos. La continuidad paga requiere contratación expresa.» | Condiciones de prueba y términos coinciden en no conversión automática, no cargos y contratación expresa. | `src/components/auth/SignupTrialConditions.tsx`; `supabase/migrations/20261029100000_company_legal_documents.sql` (§4) |
| «Al vencer, tras el período de gracia aplicable, se restringe crear vacantes, sumar personal y usar IA. Tus datos se conservan. En el registro ves los días y los límites vigentes.» | El bloque de condiciones informa restricciones tras la gracia y conservación. No se promete conservación indefinida, exportación automática ni acceso ilimitado. | `src/components/auth/SignupTrialConditions.tsx`; `docs/alta-autonoma.md`; `supabase/migrations/20261029100000_company_legal_documents.sql` (§9) |
| «Los datos se usan para gestionar tus procesos de selección según los Términos y privacidad. Al solicitar un análisis de CV con IA, su contenido puede enviarse a un proveedor externo. La IA puede dar resultados incompletos: una persona debe revisar y decidir.» | Términos de tratamiento por cuenta de la empresa, supervisión humana y política de destinatarios/IA. No es autorización general para otros usos ni para entrenar modelos. | `supabase/migrations/20261029100000_company_legal_documents.sql` (Términos §§6–7 y Privacidad §4) |
| FAQ «No se convierte automáticamente en una suscripción paga ni autoriza cargos. Para continuar con un plan pago tenés que contratarlo expresamente. Al vencer, tras el período de gracia aplicable, se restringe crear vacantes, sumar personal y usar IA. Los datos se conservan.» | Misma regla de prueba, contratación y gracia. | `src/components/auth/SignupTrialConditions.tsx`; `docs/alta-autonoma.md` |
| FAQ «No. Activar y publicar son acciones separadas. Podés mantener una búsqueda activa sin mostrarla en la bolsa pública.» | Publicación explícita y estado activo independientes. | `docs/publicacion-de-vacantes.md` |
| FAQ «Por defecto están apagados. El dueño o administrador puede habilitarlos por etapa.» | Defaults apagados y permisos de catálogo del panel. | `docs/avisos-pipeline.md`; `src/components/pipeline/PipelineConfiguration.tsx` |
| FAQ «Sí. Podés empezar gestionando tus búsquedas y sumar personas después.» | Sumar equipo es un paso opcional de puesta en marcha y no bloquea completar la guía de consultora. RRHH interno requiere responsables para las partes colaborativas del flujo; no se promete que esas partes funcionen sin otras personas. | `docs/usabilidad-puesta-en-marcha.md`; `src/components/onboarding/OnboardingChecklist.tsx` |
| FAQ «El administrador crea las cuentas del equipo. Los contactos de clientes se agregan desde la ficha del cliente.» | Alta administrativa y formulario de contactos cliente en su ficha. | `src/components/organization/UserManagementDialog.tsx`; `src/components/clients/ClientUserForm.tsx`; `docs/usuarios-clientes-roles.md` |
| Cierre: «Creá tu empresa con un correo de empresa y confirmá tu correo. Elegí cómo trabajás —consultora o RRHH interno— y seguí la guía de puesta en marcha.» | Resume alta/confirmación y bienvenida/guía posterior; no promete que al tocar el enlace la empresa ya esté creada. | `src/pages/auth/Signup.tsx`; `src/components/auth/SignupEmailConfirmation.tsx`; `src/components/onboarding/ModeWelcome.tsx`; `src/components/onboarding/OnboardingChecklist.tsx` |
| «Comenzar prueba gratuita»; «Crear empresa»; «Iniciar sesión» | Acciones a las rutas absolutas de registro y login de la app; no realizan alta desde la landing. | `src/App.tsx`; `src/pages/auth/Signup.tsx` |
| «Términos y privacidad» | Existe la página pública de documento vigente en /terminos. Esta revisión no leyó el contenido real de la base ni certifica su publicación. | `src/pages/public/CompanyLegalPage.tsx`; `src/hooks/useCompanyLegal.ts` |
| «FuenteHR es un producto de FUENTEPY S.A.»; «© … FUENTEPY S.A.»; contacto@fuentehr.com | Identidad del proveedor y contacto definidos en el documento legal del repositorio. | `supabase/migrations/20261029100000_company_legal_documents.sql` (§1 y contacto) |
| Formulario: «Usamos estos datos para responder tu consulta. Más información en Términos y privacidad». | La política contempla consultas/comunicaciones y datos de contacto. Texto de información preexistente, todavía pendiente de revisión legal para el formulario comercial; no habilita marketing. | `supabase/migrations/20261029100000_company_legal_documents.sql` (Privacidad §§2–3) |
| «Qué podemos recorrer»: «Vacantes, candidatos y pipeline»; «Lectura de CVs con apoyo de IA»; «Colaboración con clientes o responsables de contratación» | Funciones descritas en las filas anteriores; no promete datos reales, una demo personalizada ya preparada ni tiempos de implementación. | `src/App.tsx`; `docs/analisis-ia-permisos-y-primer-analisis.md`; `docs/modo-rrhh-interno.md`; `src/components/help/ClientHelpContent.tsx` |

«Dejá de perseguir candidatos entre correos y planillas» describe el dolor como
una invitación editorial, sin porcentajes ni un resultado asegurado. «Así se ve
un proceso…», «De cada perfil a una decisión compartida», «Tu próxima búsqueda
empieza acá» y los CTA son encuadres e invitaciones, no métricas.

«Ejemplo ilustrativo, no es un caso de cliente» y «Ilustración con datos de
ejemplo» identifican material creado para explicar las funciones: no son casos,
testimonios ni capturas de una cuenta real. La historia no incluye personas o
empresas con nombre propio y no implica que toda búsqueda termine contratando.

## Afirmaciones descartadas y preguntas abiertas

- **«Tus clientes participan sin pedirte reportes»**: la app permite colaborar,
  pero no demuestra que un cliente nunca pida reportes. Se usó «Tus clientes
  participan en el proceso». No queda una promesa de comportamiento del cliente.
- **Pipeline independiente de cada vacante**: la configuración vigente es general
  de empresa. Se retiró esa promesa también de la franja y la ilustración.
- **Plazos o mejoras de velocidad**: no hay medición de ahorro, velocidad,
  conversión ni resultados; no se escribieron cifras ni comparativos. La promesa
  numérica de atención también se retiró del texto/toast de la web.
- **Bloqueo incondicional de correos personales**: el código depende de
  block_free_domains. Se orienta a registrar con correo empresarial sin afirmar
  que el bloqueo esté siempre encendido. No se consultó su valor desplegado.
- No se añadieron testimonios, empresas usuarias, ahorros, certificaciones,
  disponibilidad, SLA, On-Premise, migración incluida ni invitación por enlace.
- **Dato comercial preexistente:** se mantiene WhatsApp +595 994 349 323 por la
  instrucción anterior. No se encontró ese número en la app; no es una función
  del producto. ¿Sigue siendo el canal comercial que querés usar?
- **Fuera de alcance:** api/contact-lead.ts conserva la promesa de respuesta
  numérica de la entrega anterior. No se cambió ni el handler ni su constante
  compartida. ¿Querés alinear también el correo automático en otra entrega?
- El consentimiento del formulario sigue pendiente de revisión legal. No se
  verificó que el documento de la base esté actualizado con la versión del repo.
- Sin analítica nueva no se mide mejora de conversión. La estructura AIDA es una
  decisión de redacción, no una afirmación de rendimiento comercial probado.

## Verificación y capturas

La entrega se valida desde un clon nuevo de la rama, sin reutilizar node_modules.
Los resultados ejecutados se registran al terminar. Chromium solo visita localhost,
bloquea red externa y simula /api/contact-lead; no envía correos reales. No es un
E2E del producto ni una revisión de proveedores o bases desplegadas.

Las capturas reproducibles quedan en artifacts/: landing-1440-inicio.png,
landing-390-inicio.png, landing-1440-historia.png y landing-390-historia.png.
No se agregan capturas de clientes ni cambios al diseño base. La captura de la
historia oculta únicamente el encabezado superpuesto durante la captura para
que no tape el contenido; no altera el diseño ni el comportamiento de la página.

Resultados ejecutados desde clon limpio de la rama (Node 24.19, npm 11.9):

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprobado, sin cambios al lockfile. |
| `npm run build` | Aprobado: typecheck de frontend y API, seguido de Vite build. |
| `npm test` | 50 tests aprobados en 3 archivos. Incluye los 47 existentes adaptados a los textos actuales y 3 regresiones nuevas. |
| Contraste dentro de `npm test` | Aprobado: botones y título ≥4,5:1; texto de cuerpo ≥4,5:1. No se cambió la paleta. |
| `PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | Aprobado en 1440 y 390 px y sin JavaScript. Enlaces, menú, teclado, anclas, cuatro CTA al registro, rótulo de historia, no desborde y formulario simulado con fallo y reintento. |
| `git diff --check` y `git diff 56788f6..HEAD --check` | Aprobados. |

No quedaron comandos solicitados fallidos o bloqueados. Pendiente: revisión
comercial/legal y ensayo real de la app, proveedores y otros navegadores. No se
visitó ni envió ningún formulario de una URL desplegada. No se ejecutó un merge
ni un despliegue. La mejora de conversión no se midió ni se presenta como probada.

Capturas incluidas para revisión (solo datos locales):

| Medida | Primera pantalla | Historia |
| --- | --- | --- |
| 1440 px | [Inicio](capturas/copy-persuasivo/landing-1440-inicio.png) | [Historia](capturas/copy-persuasivo/landing-1440-historia.png) |
| 390 px | [Inicio](capturas/copy-persuasivo/landing-390-inicio.png) | [Historia](capturas/copy-persuasivo/landing-390-historia.png) |

Para reproducir desde un clon nuevo:

```sh
npm ci
npm run build
npm test
PW_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
git diff --check
git diff 56788f6..HEAD --check
```

Sin Chromium del sistema, instalar antes `npx playwright install chromium` y
omitir PW_CHROMIUM_PATH. La instalación requiere red; el recorrido de la web
permanece aislado a localhost.
