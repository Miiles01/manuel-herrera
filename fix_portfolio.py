with open('src/views/home/portfolio.tsx', 'r') as f:
    code = f.read()

# 1. Modify PfCard to use white backgrounds for dishes
old_card = '''    <CardWrapper href={item.slug ? (lang === "en" ? `/en/project/${item.slug}` : `/es/proyecto/${item.slug}`) : "#"} className="pointer-events-auto relative flex h-full w-[62vw] shrink-0 flex-col justify-end overflow-hidden rounded-pf bg-[#1e1e1e] p-[4vmin] text-white [backface-visibility:hidden] [transform:translateZ(0)] block cursor-pointer group">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      )}
      
      {/* Gradiente y texto — ocultos por defecto, visibles al hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

      {/* Contenedor de texto en la parte inferior */}
      <div className="relative z-[2] flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
        <h2 className="m-0 text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.05] tracking-[-0.02em]">
          {item.title}
        </h2>
        {item.subtitle && (
          <p className="m-0 text-sm md:text-base lg:text-lg text-white/80 font-light leading-snug max-w-[85%]">
            {item.subtitle}
          </p>
        )}
      </div>
    </CardWrapper>'''

new_card = '''    <CardWrapper href={item.slug ? (lang === "en" ? `/en/project/${item.slug}` : `/es/proyecto/${item.slug}`) : "#"} className="pointer-events-auto relative flex h-full w-[62vw] shrink-0 flex-col justify-end overflow-hidden rounded-pf bg-white p-[4vmin] text-black [backface-visibility:hidden] [transform:translateZ(0)] block cursor-pointer group shadow-xl">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      )}
      
      {/* Gradiente y texto — ocultos por defecto, visibles al hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/95 via-white/70 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

      {/* Contenedor de texto en la parte inferior */}
      <div className="relative z-[2] flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
        <h2 className="m-0 text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.05] tracking-[-0.02em] text-black">
          {item.title}
        </h2>
        {item.subtitle && (
          <p className="m-0 text-sm md:text-base lg:text-lg text-gray-700 font-light leading-snug max-w-[85%]">
            {item.subtitle}
          </p>
        )}
      </div>
    </CardWrapper>'''
code = code.replace(old_card, new_card)


# 2. Add the introductory text card before the items map
old_map = '''          {items.map((item) => (
            <PfCard key={item.title} item={item} active={active} />
          ))}'''

new_map = '''          {/* Text Intro Block inside the Carousel */}
          <div className="flex flex-col justify-center h-full w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 pl-[5vw] pr-[2vw] text-white">
            <h3 className="text-sm md:text-base uppercase tracking-[0.2em] mb-4 opacity-70">Our favorites for you</h3>
            <h2 className="text-5xl md:text-[4vw] font-normal tracking-tight mb-6 leading-[1.1]">Dishes that tell a story</h2>
            <p className="text-lg md:text-[1.25vw] font-light opacity-80 leading-relaxed max-w-lg">
              Every recipe holds a piece of our heritage. Sourced daily and prepared with passion, these are the flavors that define Tulum.
            </p>
          </div>

          {items.map((item) => (
            <PfCard key={item.title} item={item} active={active} />
          ))}'''
code = code.replace(old_map, new_map)

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(code)

print("Portfolio updated")
