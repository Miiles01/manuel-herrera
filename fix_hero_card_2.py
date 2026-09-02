import re

with open('src/views/home/hero-card.tsx', 'r') as f:
    content = f.read()

# We need to completely remove the <div className="pointer-events-none absolute inset-0 z-[6] [perspective:1400px]"> and its children
# Let's find it.
start_idx = content.find('<div className="pointer-events-none absolute inset-0 z-[6] [perspective:1400px]">')
if start_idx != -1:
    # find the matching closing div. It is followed by `<animated.div` (for the bottom block)
    # The structure was:
    # <div className="pointer-events-none absolute inset-0 z-[6] [perspective:1400px]">
    #   <animated.div ...>
    #     ...
    #   </animated.div>
    # </div>
    # <animated.div className="absolute inset-x-0 bottom-0...
    
    end_idx = content.find('<animated.div className="absolute inset-x-0 bottom-0', start_idx)
    
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

with open('src/views/home/hero-card.tsx', 'w') as f:
    f.write(content)
