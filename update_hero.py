import re

with open('src/components/portfolio/PortfolioHero.tsx', 'r') as f:
    content = f.read()

# Remove the GSAP logic for scrub-container-inner
content = re.sub(r'\s*// Expansión y Parallax de la imagen Gris.*?(?=  }, { scope: heroRef });)', '', content, flags=re.DOTALL)

# Remove the second section
content = re.sub(r'\s*{/\* 2\. Scroll reveal image \(Gris\) \*/}.*?</section>', '', content, flags=re.DOTALL)

with open('src/components/portfolio/PortfolioHero.tsx', 'w') as f:
    f.write(content)
