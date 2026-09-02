import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

content = content.replace('<main className="bg-white">', '<main>')

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
