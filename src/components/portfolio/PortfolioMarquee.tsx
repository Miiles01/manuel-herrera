'use client';
export function PortfolioMarquee() {
  return (
    <section className="bg-[#FFFFFF] py-20 overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <h2 className="text-8xl md:text-[12rem] font-bold text-gray-900 tracking-tighter mx-8 uppercase">Estrategia de crecimiento •</h2>
        </div>
        <div className="animate-marquee inline-block" aria-hidden="true">
          <h2 className="text-8xl md:text-[12rem] font-bold text-gray-900 tracking-tighter mx-8 uppercase">Estrategia de crecimiento •</h2>
        </div>
      </div>
    </section>
  );
}
