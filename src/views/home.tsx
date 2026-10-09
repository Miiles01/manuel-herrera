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
import { CtaSection } from "@/views/home/cta-section";

export const HomeView = ({ lang = "es" }: { lang?: "es" | "en" }) => {
  const content = lang === "en" ? homeContentEn : homeContent;
  return (
    <>
      <PortfolioHeader lang={lang} />
      <main className="bg-white">
        <PortfolioHero lang={lang} />

        {/* The scroll experience — same on phones, tablets and desktop (phones
            used to get a separate static page). */}
        <div className="relative z-20">
          <ShowreelStage content={content} />
          {/* CTA — a normal section after the pinned stage. */}
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
      </main>
      <PortfolioFooter lang={lang} />
    </>
  );
};
