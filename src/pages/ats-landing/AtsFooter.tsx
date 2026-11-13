export const AtsFooter = () => (
  <footer className="ats-footer">
    <div className="ats-container ats-footer-inner">
      <img src="/logo-fuentehr.png" alt="FuenteHR" width={150} height={50} />
      <p>FuenteHR es un producto de FUENTEPY S.A.</p>
      <p>© {new Date().getFullYear()} FUENTEPY S.A.</p>
      <div className="ats-footer-links">
        <a href="https://app.fuentehr.com/terminos">Términos y privacidad</a>
        <a href="mailto:contacto@fuentehr.com">Contacto</a>
      </div>
    </div>
  </footer>
);
