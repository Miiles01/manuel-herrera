"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioProjects } from "@/data/portfolio";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { useParams, notFound } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function ProyectoPage() {
  const container = useRef(null);
  const params = useParams();
  const slug = params.slug as string;
  const project = portfolioProjects[slug];

  useGSAP(() => {
    if (!project) return;
    
    gsap.utils.toArray(".project-fade-up").forEach((el: any, i) => {
      // First few elements without scroll trigger, just fade up
      if (i < 2) {
        gsap.fromTo(el, 
          { opacity: 0, y: 35 }, 
          { opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: "power2.out" }
        );
      } else {
        gsap.fromTo(el, 
          { opacity: 0, y: 35 }, 
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
          }
        );
      }
    });
  }, { scope: container, dependencies: [project] });

  if (!project) return notFound();

  const basePath = `/proyectos/${project.folder}/`;

  return (
    <div className="bg-white min-h-screen text-black" ref={container}>
      <PortfolioHeader />
      
      <main className="flex-1 pt-32 md:pt-44 pb-24">
        <header className="px-6 md:px-12 lg:px-20 container mx-auto mb-16 md:mb-24">
          <h1 className="text-6xl md:text-8xl lg:text-[8vw] font-normal tracking-tight leading-tight mb-8 text-black project-fade-up opacity-0">
            {project.title}
          </h1>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-4xl project-fade-up opacity-0">
            <div>
              <p className="text-xs tracking-widest text-gray-400 mb-2 font-normal uppercase">Industria</p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-black/85">{project.industry.es}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-gray-400 mb-2 font-normal uppercase">Qué hicimos</p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-black/85">{project.role.es}</p>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 lg:px-12 mb-8 project-fade-up opacity-0">
          <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100">
            <img src={basePath + project.images[0].src} className="w-full h-auto object-cover" alt="Cover" />
          </div>
        </div>

        <div className="px-6 md:px-12 lg:px-20 container mx-auto my-20 md:my-32 project-fade-up opacity-0">
          <div className="max-w-3xl">
            <p className="text-xs tracking-widest text-gray-400 mb-4 font-normal uppercase">Sobre el proyecto</p>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-black/85 whitespace-pre-line tracking-normal">
              {project.description.es}
            </p>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {project.images.slice(1).map((img, i) => (
            <div key={i} className="px-4 md:px-8 lg:px-12 project-fade-up opacity-0">
              <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100">
                <img src={basePath + img.src} className="w-full h-auto object-cover" loading="lazy" alt={`Project detail ${i + 1}`} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 md:px-12 lg:px-20 container mx-auto mt-32 text-center project-fade-up opacity-0">
          <Link href="/trabajo" className="inline-flex items-center gap-3 text-2xl md:text-3xl font-normal tracking-tight text-black hover:opacity-60 transition-opacity">
            &larr; Volver a proyectos
          </Link>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
