import re

with open('src/components/portfolio/PortfolioFooter.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { useEffect } from "react";', 'import { useEffect } from "react";\nimport Link from "next/link";')
content = content.replace('<a href="/contacto" className', '<Link href="/contacto" className')
content = content.replace('Contactar\n          </a>', 'Contactar\n          </Link>')

with open('src/components/portfolio/PortfolioFooter.tsx', 'w') as f:
    f.write(content)
