import glob

files = [
    'src/app/proyecto/[slug]/page.tsx',
    'src/app/trabajo/page.tsx',
    'src/app/not-found.tsx',
    'src/components/ui/arrow-button.tsx',
    'src/components/portfolio/PortfolioHeader.tsx',
    'src/components/portfolio/PortfolioFooter.tsx',
    'src/views/home/portfolio.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace imports
    content = content.replace('import Link from "next/link"', 'import { TransitionLink } from "@/components/ui/transition-link"')
    content = content.replace("import Link from 'next/link'", 'import { TransitionLink } from "@/components/ui/transition-link"')
    
    # Replace tags
    content = content.replace('<Link', '<TransitionLink')
    content = content.replace('</Link>', '</TransitionLink>')
    
    with open(file, 'w') as f:
        f.write(content)

