import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

# Change closed height from 50px to 60px
content = content.replace('max-h-[50px]', 'max-h-[60px]')
content = content.replace('h-[50px]', 'h-[60px]')

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
