import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

# Change right-[100px] to right-4 (since Hablemos is hidden on mobile)
content = content.replace('right-[100px] md:right-[140px]', 'right-4 md:right-[140px]')

# Change w-80 to almost full width on mobile: w-[calc(100vw-2rem)]
content = content.replace('w-80 md:w-[420px]', 'w-[calc(100vw-2rem)] md:w-[420px]')

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
