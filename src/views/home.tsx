/**
 * Home view — Showreel ("Prompts that think ahead"), a 1:1 rebuild of the
 * original vanilla scroll-driven WebGL showreel. A Server Component that
 * composes the fixed nav and the scroll stage; all motion/3D lives in the
 * client leaves under `views/home/` and `components/3d/`.
 */
import { homeContent } from "@/data/mocks/home";
import { ShowreelStage } from "@/views/home/showreel-stage";
import { PortfolioLoader } from "@/components/portfolio/PortfolioLoader";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";

export const HomeView = () => (
  <>
    <PortfolioLoader />
    <PortfolioHeader />
    <main className="bg-white">
      <PortfolioHero />
      
      {/* The new immersive experience from AI Studio */}
      <div className="relative z-20"><ShowreelStage content={homeContent} /></div>
    </main>
    <PortfolioFooter />
  </>
);
