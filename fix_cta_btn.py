import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

content = content.replace('rounded-btn bg-ink', 'rounded-full bg-ink')

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
