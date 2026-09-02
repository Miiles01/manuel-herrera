import re

with open('src/views/home/portfolio.tsx', 'r') as f:
    content = f.read()

content = content.replace('const CardWrapper = item.slug ? Link : "div";', 'const CardWrapper = item.slug ? TransitionLink : "div" as any;')

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(content)
