import { homeContent } from "@/data/mocks/home";
import { HeroSection } from "@/views/home/hero-section";
import { TrustSection } from "@/views/home/trust-section";
import { ProgramsSection } from "@/views/home/programs-section";
import { FacilitiesSection } from "@/views/home/facilities-section";
import { StatsSection } from "@/views/home/stats-section";
import { TestimonialsSection } from "@/views/home/testimonials-section";
import { SiteFooter } from "@/views/home/site-footer";
import { ContactModal } from "@/views/home/contact-modal";

/**
 * Baseline home page — a Server Component that assembles the animated client
 * sections and feeds them placeholder content from the mock layer.
 */
export const HomeView = () => {
  const {
    brand,
    navLeft,
    cta,
    hero,
    trust,
    programs,
    facilities,
    stats,
    testimonials,
    footer,
  } = homeContent;

  return (
    <main className="w-full overflow-x-clip bg-background p-2 sm:p-3">
      <HeroSection brand={brand} navLeft={navLeft} cta={cta} hero={hero} />
      <TrustSection trust={trust} />
      <ProgramsSection programs={programs} />
      <FacilitiesSection facilities={facilities} />
      <StatsSection stats={stats} />
      <TestimonialsSection testimonials={testimonials} />
      <SiteFooter brand={brand} cta={cta} footer={footer} />
      <ContactModal />
    </main>
  );
};
