import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Replace --font-sans mapping
content = content.replace('--font-sans: var(--font-zen);', '--font-sans: var(--font-manrope);')

# We can also clean up the duplicate body tag at the end, as Tailwind's default sans is now manrope
content = re.sub(r'body \{\n\s*font-family: var\(--font-manrope\), sans-serif;\n\}\n*$', '', content)

with open('src/app/globals.css', 'w') as f:
    f.write(content)

with open('src/app/layout.tsx', 'r') as f:
    layout = f.read()

# Remove zenKaku variable from body
layout = layout.replace('${zenKaku.variable} ', '')

with open('src/app/layout.tsx', 'w') as f:
    f.write(layout)
