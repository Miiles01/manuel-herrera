import re

with open('src/components/portfolio/PortfolioFooter.tsx', 'r') as f:
    content = f.read()

content = content.replace('Contactar\n          </TransitionLink>', 'Contacto\n          </TransitionLink>')

with open('src/components/portfolio/PortfolioFooter.tsx', 'w') as f:
    f.write(content)
