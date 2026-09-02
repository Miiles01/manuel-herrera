import re

with open('src/components/portfolio/PortfolioHero.tsx', 'r') as f:
    content = f.read()

target = """    // Parallax del Hero
    gsap.to('#hero-content', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }, { scope: heroRef });"""

replacement = """    // Parallax del Hero
    gsap.to('#hero-content', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      heroText.revert();
      introText.revert();
    };
  }, { scope: heroRef });"""

content = content.replace(target, replacement)

with open('src/components/portfolio/PortfolioHero.tsx', 'w') as f:
    f.write(content)
