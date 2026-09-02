import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

# Remove imports
content = re.sub(r'import { PortfolioMarquee } from "@/components/portfolio/PortfolioMarquee";\n', '', content)
content = re.sub(r'import { PortfolioSkills } from "@/components/portfolio/PortfolioSkills";\n', '', content)

# Remove components
content = re.sub(r'\s*<PortfolioMarquee />', '', content)
content = re.sub(r'\s*<PortfolioSkills />', '', content)

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
