import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace('href="/trabajo.html"', 'href="/trabajo"')
content = content.replace('href="/contacto.html"', 'href="/contacto"') # I will leave contacto as is or make it a page later, for now just remove html
content = content.replace('href="contacto.html"', 'href="/contacto"') 

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)

with open('src/components/portfolio/PortfolioFooter.tsx', 'r') as f:
    content = f.read()

content = content.replace('href="/contacto.html"', 'href="/contacto"')

with open('src/components/portfolio/PortfolioFooter.tsx', 'w') as f:
    f.write(content)
