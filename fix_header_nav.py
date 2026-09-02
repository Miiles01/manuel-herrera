import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Link href="/trabajo" className="hover:text-gray-500 transition-colors">Mis trabajos</Link>',
    '<Link href="/" className="hover:text-gray-500 transition-colors">Inicio</Link>\n          <Link href="/trabajo" className="hover:text-gray-500 transition-colors">Mis trabajos</Link>'
)

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
