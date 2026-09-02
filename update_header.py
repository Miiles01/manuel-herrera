import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

# Make navbar wider: w-72 md:w-96 -> w-80 md:w-[420px]
content = content.replace('w-72 md:w-96', 'w-80 md:w-[420px]')

# Fix the X angles and centering
old_line1 = """<div className={`h-px bg-gray-600 w-full transition-transform duration-300 ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>"""
old_line2 = """<div className={`h-px bg-gray-600 w-full transition-transform duration-300 ${isMenuOpen ? 'translate-y-[-3.5px] rotate-[-15deg]' : ''}`}></div>"""

# Better X: translate 3.5px (center) and rotate 45 degrees
new_line1 = """<div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}></div>"""
new_line2 = """<div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[-3.5px] -rotate-45' : ''}`}></div>"""

content = content.replace(old_line1, new_line1)
content = content.replace(old_line2, new_line2)

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
