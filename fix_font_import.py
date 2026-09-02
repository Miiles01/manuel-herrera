import re

with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

# Remove the next/font/google import of Manrope
content = re.sub(r'const manrope = Manrope\(\{[\s\S]*?\}\);\n', '', content)
content = content.replace(', Manrope', '')
content = content.replace(' ${manrope.variable}', '')

# Add Google Fonts link to <head>
head_links = """
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body"""

content = content.replace('<body', head_links)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)
