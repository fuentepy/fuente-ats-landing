import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import AtsLandingPage from "./pages/ats-landing/AtsLandingPage";

// Visitantes que antes entraron al dominio de la app pueden tener registrado
// un service worker viejo (sw.js) que serviría contenido desactualizado.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((r) => r.unregister()))
    .catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <>
    <AtsLandingPage />
    <Toaster richColors position="top-center" />
  </>
);
