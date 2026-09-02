import re

with open('src/views/home/portfolio.tsx', 'r') as f:
    content = f.read()

# Replace PfCard entirely
old_card_pattern = r'const PfCard = \(\{ item, active \}: \{ item: PortfolioItem; active: boolean \}\) => \{.*?</CardWrapper>\n  \);\n\};'

new_card = """const PfCard = ({ item, active }: { item: PortfolioItem; active: boolean }) => {
  const CardWrapper = item.slug ? Link : "div";
  return (
    <CardWrapper href={item.slug ? `/proyecto/${item.slug}` : "#"} className="relative flex h-full w-[62vw] shrink-0 flex-col justify-end overflow-hidden rounded-pf bg-[#1e1e1e] p-[4vmin] text-white [backface-visibility:hidden] [transform:translateZ(0)] block cursor-pointer group">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      )}
      
      {/* Sutil sombra solo desde abajo para que el texto sea legible */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]" />
      
      {/* Contenedor de texto en la parte inferior */}
      <div className="relative z-[2] flex flex-col gap-2 w-full">
        <h3 className="m-0 text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.05] tracking-[-0.02em]">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="m-0 text-sm md:text-base lg:text-lg text-white/80 font-light leading-snug max-w-[85%]">
            {item.subtitle}
          </p>
        )}
      </div>
    </CardWrapper>
  );
};"""

content = re.sub(old_card_pattern, new_card, content, flags=re.DOTALL)

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(content)
