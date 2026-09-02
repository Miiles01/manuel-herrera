import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

target = """      <animated.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30"
        style={{ opacity: s.aurora }}
      >
        <FlameBackground className="absolute inset-0" active={vis.aurora} />
      </animated.div>"""

content = content.replace(target, '')

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
