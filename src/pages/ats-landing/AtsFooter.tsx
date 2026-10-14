import logo from "@/assets/landing/logo-fuentepy-color.png";

export const AtsFooter = () => {
  return (
    <footer style={{ borderTop: "1px solid hsl(var(--ats-border))", padding: "2rem 0" }}>
      <div
        className="ats-container"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "space-between", textAlign: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <img src={logo} alt="FuentePy" style={{ height: "1.5rem", width: "auto" }} />
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>ATS Reclutamiento</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "hsl(var(--ats-muted-fg))" }}>
          © {new Date().getFullYear()} FuentePy. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
