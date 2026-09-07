/**
 * Home view — Showreel ("Prompts that think ahead"), a 1:1 rebuild of the
 * original vanilla scroll-driven WebGL showreel. A Server Component that
 * composes the fixed nav and the scroll stage; all motion/3D lives in the
 * client leaves under `views/home/` and `components/3d/`.
 */
import { homeContent, homeContentEn } from "@/data/mocks/home";
import { ShowreelStage } from "@/views/home/showreel-stage";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";

export const HomeView = ({ lang = "es" }: { lang?: "es" | "en" }) => (
  <>
    <PortfolioHeader lang={lang} />
    <main className="bg-white">
      <PortfolioHero lang={lang} />
      
      {/* The new immersive experience from AI Studio */}
      <div className="relative z-20"><ShowreelStage content={lang === "en" ? homeContentEn : homeContent} /></div>
    </main>
    <PortfolioFooter lang={lang} />
  </>
);
