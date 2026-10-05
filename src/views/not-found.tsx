"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";

export default function NotFound() {
  const container = useRef(null);
  const lang = usePathname()?.startsWith("/en") ? "en" : "es";

  useGSAP(() => {
    gsap.utils.toArray(".fade-up").forEach((el: any, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, ease: "power3.out" }
      );
    });
  }, { scope: container });

  return (
    <div className="bg-white min-h-screen text-black flex flex-col" ref={container}>
      <PortfolioHeader lang={lang} />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-48 pb-32">
        <h1 className="text-8xl md:text-[12vw] font-normal tracking-tighter leading-none mb-6 text-black fade-up opacity-0">
          {lang === "en" ? "Oops." : "Ups."}
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-500 mb-12 max-w-lg fade-up opacity-0">
          {lang === "en" ? "Something went wrong or the page you are looking for does not exist." : "Algo salió mal o la página que estás buscando no existe."}
        </p>
        <div className="fade-up opacity-0">
          <TransitionLink 
            href={lang === "en" ? "/en" : "/es"} 
            className="inline-flex items-center justify-center bg-black text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-800 hover:scale-105 transition-all"
          >
            {lang === "en" ? "Back to home" : "Volver al inicio"}
          </TransitionLink>
        </div>
      </main>

      <PortfolioFooter lang={lang} />
    </div>
  );
}
