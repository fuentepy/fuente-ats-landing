import "./styles.css";
import { Toaster } from "sonner";
import { useWebTheme } from "./useWebTheme";
import { useReveal } from "./useReveal";
import { AtsNav } from "./AtsNav";
import { AtsHero } from "./AtsHero";
import { AtsFlow } from "./AtsFlow";
import { AtsAudience } from "./AtsAudience";
import { AtsFeatures } from "./AtsFeatures";
import { AtsShowcase } from "./AtsShowcase";
import { AtsTrialAndFaq } from "./AtsTrialAndFaq";
import { AtsHowItWorks } from "./AtsHowItWorks";
import { AtsCtaForm } from "./AtsCtaForm";
import { AtsFooter } from "./AtsFooter";

// Landing de venta del software ATS (modulo de reclutamiento) a otras empresas/consultoras.
export default function AtsLandingPage() {
  useReveal();
  const { theme, toggleTheme } = useWebTheme();
  return (
    <div className="landing-ats">
      <AtsNav theme={theme} onToggleTheme={toggleTheme} />
      <main id="contenido" tabIndex={-1}>
      <AtsHero />
      <AtsFlow />
      <AtsAudience />
      <AtsFeatures />
      <AtsShowcase />
      <AtsHowItWorks />
      <AtsTrialAndFaq />
      <AtsCtaForm />
      </main>
      <AtsFooter theme={theme} />
      <Toaster richColors position="top-center" theme={theme} />
    </div>
  );
}
