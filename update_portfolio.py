import re

with open('src/views/home/portfolio.tsx', 'r') as f:
    content = f.read()

# Update PfCard
old_card = """const PfCard = ({ item, active }: { item: PortfolioItem; active: boolean }) => (
  // `translateZ(0)` + `backface-visibility:hidden` keep each card (and its video)
  // on a stable GPU layer so the horizontal track-pan is a pure composite — no
  // per-frame re-raster flicker as the cards slide.
  <article className="relative flex h-full w-[62vw] shrink-0 flex-col justify-between overflow-hidden rounded-pf bg-[#1e1e1e] p-[3.5vmin] text-white [backface-visibility:hidden] [transform:translateZ(0)]">
    {/* Each clip is multi-MB; only mount it (so the browser fetches + autoplays)
        once the section is near, keeping it out of the initial page load. */}
    
    {/* All tags on one line: client · year · discipline. */}
    <div className="relative z-[2] flex flex-wrap items-center gap-[1.4vmin] text-[1.7vmin] opacity-90">"""

new_card = """const PfCard = ({ item, active }: { item: PortfolioItem; active: boolean }) => (
  // `translateZ(0)` + `backface-visibility:hidden` keep each card (and its video)
  // on a stable GPU layer so the horizontal track-pan is a pure composite — no
  // per-frame re-raster flicker as the cards slide.
  <article className="relative flex h-full w-[62vw] shrink-0 flex-col justify-between overflow-hidden rounded-pf bg-[#1e1e1e] p-[3.5vmin] text-white [backface-visibility:hidden] [transform:translateZ(0)]">
    {item.image && (
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 size-full object-cover object-center opacity-60 transition-transform duration-1000 ease-out hover:scale-110"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]" />
    
    {/* All tags on one line: client · year · discipline. */}
    <div className="relative z-[2] flex flex-wrap items-center gap-[1.4vmin] text-[1.7vmin] opacity-90">"""
content = content.replace(old_card, new_card)

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(content)
