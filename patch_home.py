import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { PortfolioLoader } from "@/components/portfolio/PortfolioLoader";\n', '')
content = content.replace('<PortfolioLoader />\n', '')

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
