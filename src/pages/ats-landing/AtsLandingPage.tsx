import "./styles.css";
import { AtsNav } from "./AtsNav";
import { AtsHero } from "./AtsHero";
import { AtsAudience } from "./AtsAudience";
import { AtsFeatures } from "./AtsFeatures";
import { AtsShowcase } from "./AtsShowcase";
import { AtsProcessFlow } from "./AtsProcessFlow";
import { AtsHowItWorks } from "./AtsHowItWorks";
import { AtsCtaForm } from "./AtsCtaForm";
import { AtsFooter } from "./AtsFooter";

// Landing de venta del software ATS (modulo de reclutamiento) a otras empresas/consultoras.
export default function AtsLandingPage() {
  return (
    <div className="landing-ats">
      <AtsNav />
      <AtsHero />
      <AtsAudience />
      <AtsFeatures />
      <AtsShowcase />
      <AtsProcessFlow />
      <AtsHowItWorks />
      <AtsCtaForm />
      <AtsFooter />
    </div>
  );
}
