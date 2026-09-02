import re

with open('src/views/home/sphere-card.tsx', 'r') as f:
    content = f.read()

# Replace the ParticleSphere JSX strictly
content = re.sub(
    r'<ParticleSphere\s+className="size-full"\s+active=\{active\}\s+disperse=\{\(\) => sphereDisperse\(p\.get\(\)\)\}\s+/>',
    '',
    content
)

# And remove its wrapping animated.div just to be clean
content = re.sub(
    r'<animated\.div\s+className="absolute left-1/2 top-1/2 z-\[2\] size-full"\s+style=\{\{\s+transform: p\.to\(\(v\) => `translate\(-50%, -50%\) scale\(\$\{sphereScale\(v\)\}\)`\),\s+\}\}\s*>\s*</animated\.div>',
    '',
    content
)

with open('src/views/home/sphere-card.tsx', 'w') as f:
    f.write(content)
