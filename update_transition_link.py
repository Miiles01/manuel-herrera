import re

with open('src/components/ui/transition-link.tsx', 'r') as f:
    content = f.read()

# Make sure it doesn't transition for anchor links
content = content.replace('if (target === "_blank") return;', 'if (target === "_blank") return;\n    if (href.startsWith("#")) return;')

with open('src/components/ui/transition-link.tsx', 'w') as f:
    f.write(content)
