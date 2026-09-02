import re

with open('src/views/home/cta-block.tsx', 'r') as f:
    content = f.read()

content = content.replace('rounded-btn bg-paper', 'rounded-full bg-paper')

with open('src/views/home/cta-block.tsx', 'w') as f:
    f.write(content)
