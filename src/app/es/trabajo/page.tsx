"use client";
import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioProjects } from "@/data/portfolio";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { useLoaderStore } from "@/hooks/use-loader";

gsap.registerPlugin(ScrollTrigger);

export default function TrabajoPage() {
  const container = useRef(null);
  const isRevealed = useLoaderStore((s) => s.revealed);

  useGSAP(() => {
    // Initial static fade-up for paragraph
    gsap.utils.toArray("p.fade-up-hero").forEach((el: any, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, delay: i * 0.1, ease: "power3.out" }
      );
    });

    // Setup SplitType for title
    const titleText = new SplitType('#page-title', { types: 'chars' });
    gsap.set(titleText.chars, { yPercent: 100 });

    gsap.utils.toArray(".project-fade-up").forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" }
        }
      );
    });

    return () => {
      titleText.revert();
    };
  }, { scope: container });

  useGSAP(() => {
    if (isRevealed) {
      const titleChars = document.querySelectorAll('#page-title .char');
      if (titleChars.length) {
        gsap.to(titleChars, {
          yPercent: 0,
          stagger: { each: 0.05, from: "random" },
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }
  }, [isRevealed]);

  const projects = Object.values(portfolioProjects);

  return (
    <div className="bg-white min-h-screen text-black" ref={container}>
      <PortfolioHeader />
      
      <main className="flex-1 pt-36 md:pt-48 pb-20">
        <section className="px-6 md:px-12 lg:px-20 container mx-auto mb-20 md:mb-32">
          <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight max-w-3xl mb-6 text-black leading-relaxed fade-up-hero opacity-0">
            Pensamos con propósito para marcas que buscan autenticidad y escalabilidad.
          </p>
          <h1 id="page-title" className="text-6xl md:text-8xl lg:text-[7.5vw] font-normal tracking-tight leading-[1.05] text-black" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
            Proyectos
          </h1>
        </section>

        <section className="px-4 md:px-8 lg:px-12 pb-12">
          {projects.map(proj => {
            const cover = proj.previewImages[0];
            const secondary = [proj.previewImages[1], proj.previewImages[2]];
            const slug = proj.slug;
            const title = proj.title;
            const subtitle = proj.subtitle.es;
            
            return (
              <div key={slug} className="mb-28 md:mb-40 group project-item">
                <TransitionLink href={`/es/proyecto/${slug}`} className="block w-full mb-6 md:mb-8 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gray-100 transition-all project-fade-up opacity-0">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img src={`/proyectos/${proj.folder}/${cover}`} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  </div>
                </TransitionLink>
                
                {secondary[0] && secondary[1] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                    <TransitionLink href={`/es/proyecto/${slug}`} className="block overflow-hidden rounded-[2rem] bg-gray-100 transition-all project-fade-up opacity-0">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img src={`/proyectos/${proj.folder}/${secondary[0]}`} alt={`${title} preview 1`} className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]" />
                      </div>
                    </TransitionLink>
                    <TransitionLink href={`/es/proyecto/${slug}`} className="block overflow-hidden rounded-[2rem] bg-gray-100 transition-all project-fade-up opacity-0">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img src={`/proyectos/${proj.folder}/${secondary[1]}`} alt={`${title} preview 2`} className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]" />
                      </div>
                    </TransitionLink>
                  </div>
                )}
                
                <div className="px-2 md:px-4 flex flex-col md:flex-row md:items-end justify-between gap-4 project-fade-up opacity-0">
                  <div className="max-w-2xl">
                    <TransitionLink href={`/es/proyecto/${slug}`} className="inline-flex items-center gap-2 group/title">
                      <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-black transition-colors hover:text-blue-600">{title}</h2>
                    </TransitionLink>
                    <p className="text-base md:text-lg font-light text-black/70 mt-2 leading-relaxed tracking-normal">{subtitle}</p>
                  </div>
                  <TransitionLink href={`/es/proyecto/${slug}`} className="inline-flex items-center gap-1.5 text-xs font-normal uppercase tracking-widest text-gray-400 hover:text-black transition-colors pt-2 md:pt-0">
                    Ver proyecto completo &rarr;
                  </TransitionLink>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      
      <PortfolioFooter />
    </div>
  );
}
