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
import { MobilePortfolio } from "@/views/home/mobile-portfolio";
import { MobileShowreel } from "@/views/home/mobile-showreel";
import { CtaSection } from "@/views/home/cta-section";

export const HomeView = ({ lang = "es" }: { lang?: "es" | "en" }) => {
  const content = lang === "en" ? homeContentEn : homeContent;
  return (
    <>
      <PortfolioHeader lang={lang} />
      <main className="bg-white">
        <PortfolioHero lang={lang} />

        {/* The new immersive experience from AI Studio */}
        <div className="relative z-20">
          <div className="max-sm:hidden">
            <ShowreelStage content={content} />
          </div>
          {/* CTA — a normal section after the pinned stage (desktop/tablet; mobile
              has it at the end of MobilePortfolio). */}
          <div className="max-sm:hidden">
            <CtaSection
              lang={lang}
              heading={content.cta.heading}
              headingFaded={content.cta.headingFaded}
              button={content.cta.button}
              href={content.cta.href}
              reviewsLabel={content.cta.reviewsLabel}
              reviewsHref={content.cta.reviewsHref}
            />
          </div>
          <MobileShowreel content={content} />
          <MobilePortfolio content={content} lang={lang} />
        </div>
      </main>
      <PortfolioFooter lang={lang} />
    </>
  );
};
