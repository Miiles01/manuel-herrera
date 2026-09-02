import re

with open('src/views/home/marquee.tsx', 'r') as f:
    content = f.read()

# Replace the Strip component entirely
old_strip = """const Strip = ({ items }: MarqueeProps) => (
  <>
    {items.map((item, i) => (
      <Fragment key={i}>
        <span className="px-[3vw] text-[11vw] tracking-[-0.03em] text-black">
          {item}
        </span>
        <span
          aria-hidden="true"
          className="size-[1.5vw] shrink-0 translate-y-[1.2vw] rounded-full border-2 border-black"
        />
      </Fragment>
    ))}
  </>
);"""

new_strip = """const Strip = ({ items }: MarqueeProps) => (
  <>
    {items.map((item, i) => (
      <Fragment key={i}>
        <span className="px-[4vw] text-[16vw] tracking-[-0.04em] text-black">
          {item}
        </span>
      </Fragment>
    ))}
  </>
);"""

content = content.replace(old_strip, new_strip)

with open('src/views/home/marquee.tsx', 'w') as f:
    f.write(content)
