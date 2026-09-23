"use client";
import { CtaBlock } from "@/views/home/cta-block";
import { TransitionLink } from "@/components/ui/transition-link";

export const MobilePortfolio = ({ content, lang = "es" }: { content: any, lang?: "es"|"en" }) => {
  return (
    <section className="sm:hidden w-full bg-[#08060c] flex flex-col pt-12 pb-24 px-4 z-10 relative">
      <h2 className="text-4xl font-medium tracking-tight text-white mb-8 ml-2 mt-8">
        Proyectos destacados
      </h2>
      
      <div className="flex flex-col gap-6 w-full">
        {content.portfolio.items.map((item: any) => {
          const CardWrapper = item.slug ? TransitionLink : ("div" as any);
          return (
            <CardWrapper 
              key={item.title} 
              href={item.slug ? (lang === "en" ? `/en/project/${item.slug}` : `/es/proyecto/${item.slug}`) : "#"} 
              className="relative flex w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-[#1e1e1e] p-6 text-white block cursor-pointer group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 size-full object-cover object-center"
                />
              )}
              {/* Texto (sin overlay por diseño) */}
              <div className="relative z-[2] flex flex-col justify-end gap-1 w-full h-full opacity-100">
                <h3 className="m-0 text-2xl font-normal leading-[1.05] tracking-[-0.02em]">
                  {item.title}
                </h3>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      <div className="w-full mt-24 relative">
        <CtaBlock
          p={null as any}
          heading={content.cta.heading}
          headingFaded={content.cta.headingFaded}
          sub={content.cta.sub}
          button={content.cta.button}
          href={content.cta.href}
        />
      </div>
    </section>
  );
};
