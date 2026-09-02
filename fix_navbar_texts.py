import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace('>Mis trabajos</TransitionLink>', '>Trabajo</TransitionLink>')
content = content.replace('>Contactar</TransitionLink>', '>Contacto</TransitionLink>')

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
