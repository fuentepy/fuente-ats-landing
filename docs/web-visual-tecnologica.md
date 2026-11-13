# Rediseño visual de la web (tema oscuro tecnológico)

Rama `feat/web-visual-tecnologica`, desde `main` (`2ac4220`). Sin cambios de endpoint,
formulario, esquema, rutas ni metadatos.

- Tema oscuro con acento lima de la marca, rejilla y resplandor en el hero (CSS, sin imágenes nuevas).
- Menos texto visible: cada tarjeta muestra una línea y el detalle completo queda en acordeones
  (`<details>`), así sigue en el DOM y en el HTML estático. Textos legales y de condiciones intactos.
- Franja «Recorrido» (Solicitud → Contratación), tarjetas con íconos, pasos numerados, CTA de prueba
  destacado, FAQ en acordeón.
- Aparición al hacer scroll solo con JavaScript y sin `prefers-reduced-motion` (clase `ats-motion`).
- Sin prueba social inventada: no hay logos, cifras ni testimonios. Falta cargar datos reales.
- Contraste medido sobre los tokens reales (tests/contrast.test.ts, actualizado al tema oscuro).
