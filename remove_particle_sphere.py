import re

with open('src/views/home/sphere-card.tsx', 'r') as f:
    content = f.read()

# Remove the ParticleSphere import
content = re.sub(r'import \{ ParticleSphere \} from "@/components/3d/particle-sphere";\n', '', content)

# Remove the ParticleSphere block
pattern = r'\{/\* Sphere shell: shrinks.*?\}\)'
# Let's match from the comment to the closing animated.div
pattern_block = r'\s*\{/\* Sphere shell: shrinks.*?\}\s*</animated\.div>'

content = re.sub(pattern_block, '', content, flags=re.DOTALL)

with open('src/views/home/sphere-card.tsx', 'w') as f:
    f.write(content)
