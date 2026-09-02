import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

content = content.replace('<main>', '<main className="bg-white">')

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
