import re

with open('src/components/portfolio/PortfolioFooter.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useRef } from 'react';", "import { useRef } from 'react';\nimport Link from 'next/link';")

with open('src/components/portfolio/PortfolioFooter.tsx', 'w') as f:
    f.write(content)
