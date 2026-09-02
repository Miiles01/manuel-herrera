import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="absolute inset-0 z-0 bg-white"', 'className="absolute inset-0 z-0 bg-transparent"')

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
