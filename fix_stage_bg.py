import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

replacement = """          <animated.div
            aria-hidden="true"
            className="absolute inset-0 z-0"
            style={{ 
              backgroundColor: "var(--background)",
              opacity: s.backdrop.to(v => 1 - v)
            }}
          />"""

content = re.sub(
    r'<animated\.div\s+aria-hidden="true"\s+className="absolute inset-0 z-0 bg-transparent"\s+style={{ opacity: s\.backdrop }}\s+/>',
    replacement,
    content
)

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
