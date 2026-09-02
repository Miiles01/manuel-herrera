import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

# Pattern for the FlameBackground import
content = re.sub(r'import \{ FlameBackground \} from "@/components/3d/flame-background";\n', '', content)

# Pattern for the animated div containing FlameBackground
pattern_block = r'\s*\{/\* Pinned background elements.*?\}\s*<animated\.div\s+aria-hidden="true"\s+className="absolute inset-0 z-\[1\] \[mix-blend-mode:screen\]"\s+style=\{\{ opacity: s\.aurora \}\}\s*>\s*<FlameBackground className="absolute inset-0" active=\{vis\.aurora\} />\s*</animated\.div>'

content = re.sub(pattern_block, '', content, flags=re.DOTALL)

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
