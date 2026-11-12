export const AtsFooter = () => (
  <footer style={{ borderTop: "1px solid hsl(var(--ats-border))", padding: "2rem 0" }}>
    <div className="ats-container" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
      <img src="/logo-fuentehr-light.png" alt="FuenteHR" width={150} height={50} />
      <p>FuenteHR es un producto de FUENTEPY S.A.</p>
      <p>© {new Date().getFullYear()} FUENTEPY S.A.</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
        <a href="https://app.fuentehr.com/terminos">Términos y privacidad</a>
        <a href="mailto:contacto@fuentehr.com">Contacto</a>
      </div>
    </div>
  </footer>
);
