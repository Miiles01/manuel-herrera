import re

with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    content = f.read()

# Replace the flex gap container with an absolute positioned container
old_menu = """          <div className="flex flex-col gap-1.5 w-8 relative">
            <div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}></div>
            <div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[-3.5px] -rotate-45' : ''}`}></div>
          </div>"""

new_menu = """          <div className="w-8 h-[8px] relative">
            <div className={`absolute top-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>
            <div className={`absolute bottom-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? '-translate-y-[3.5px] -rotate-[15deg]' : ''}`}></div>
          </div>"""

content = content.replace(old_menu, new_menu)

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(content)
