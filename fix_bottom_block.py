import re

with open('src/views/home/hero-card.tsx', 'r') as f:
    content = f.read()

# Replace everything from {bottomBlock && ( down to )}
pattern = r'\{bottomBlock && \(.*?\)\}'
replacement = """{bottomBlock && (
        <animated.div
          className="pointer-events-none absolute bottom-0 left-0 w-full p-[40px] max-sm:p-5 z-[6] flex flex-col gap-6 max-sm:gap-4 text-white font-light"
          style={{ opacity: p.to(heroContentFade) }}
        >
          <div className="flex flex-col gap-6 max-sm:gap-4 max-w-md pointer-events-auto">
            <p className="opacity-90 leading-relaxed text-[16px] max-sm:text-[14px]">
              {bottomBlock.leftText}
            </p>
          </div>
          <div className="flex justify-between items-end w-full max-sm:hidden">
            <div></div>
            <p className="max-w-lg opacity-90 leading-relaxed text-right text-[15px] pointer-events-auto">
              {bottomBlock.rightText}
            </p>
          </div>
        </animated.div>
      )}"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/views/home/hero-card.tsx', 'w') as f:
    f.write(content)
