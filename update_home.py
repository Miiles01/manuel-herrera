import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

# Replace imports
old_imports = """import { IntroLoader } from "@/views/home/intro-loader";
import { SiteHeader } from "@/views/home/site-header";
import { ShowreelStage } from "@/views/home/showreel-stage";"""

new_imports = """import { ShowreelStage } from "@/views/home/showreel-stage";
import { PortfolioLoader } from "@/components/portfolio/PortfolioLoader";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioMarquee } from "@/components/portfolio/PortfolioMarquee";
import { PortfolioSkills } from "@/components/portfolio/PortfolioSkills";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";"""

content = content.replace(old_imports, new_imports)

# Replace HomeView body
old_body = """export const HomeView = () => (
  <>
    {/* Immersive intro: spins the brand star, then lifts to reveal the page.
        Flips `useLoaderStore.ready` (page uncover) then `revealed` (header). */}
    <IntroLoader />

    {/* SiteHeader self-reveals its (normal-flow) nav bar once the loader has
        fully lifted — see its own `useLoaderStore.revealed` spring. Animating a
        wrapper's opacity around the fixed <header> snapped instead of fading.
        The stage is NOT opacity-gated: it renders at full opacity *under* the
        opaque loader (WebGL warms up) and is simply UNCOVERED when the loader
        lifts — fading a live WebGL surface in would hitch the reveal. */}
    <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} />
    <main>
      <ShowreelStage content={homeContent} />
    </main>
  </>
);"""

new_body = """export const HomeView = () => (
  <>
    <PortfolioLoader />
    <PortfolioHeader />
    <main className="bg-white">
      <PortfolioHero />
      <PortfolioMarquee />
      <PortfolioSkills />
      
      {/* The new immersive experience from AI Studio */}
      <ShowreelStage content={homeContent} />
    </main>
    <PortfolioFooter />
  </>
);"""

content = content.replace(old_body, new_body)

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
