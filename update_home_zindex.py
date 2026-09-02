import re

with open('src/views/home.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<ShowreelStage content={homeContent} />',
    '<div className="relative z-20"><ShowreelStage content={homeContent} /></div>'
)

with open('src/views/home.tsx', 'w') as f:
    f.write(content)
