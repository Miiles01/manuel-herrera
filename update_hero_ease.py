with open('src/components/portfolio/PortfolioHero.tsx', 'r') as f:
    content = f.read()

content = content.replace('ease: "osmo-ease"', 'ease: "power3.out"')
content = content.replace('gsap.registerEase("osmo-ease", "M0,0 C0.25,1 0.5,1 1,1");\n', '')

with open('src/components/portfolio/PortfolioHero.tsx', 'w') as f:
    f.write(content)
