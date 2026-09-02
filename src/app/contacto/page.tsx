"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";

export default function ContactoPage() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray(".fade-up-hero").forEach((el: any, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, delay: i * 0.1, ease: "power3.out" }
      );
    });

    gsap.utils.toArray(".fade-up-content").forEach((el: any, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, delay: 0.3 + (i * 0.1), ease: "power3.out" }
      );
    });
  }, { scope: container });

  return (
    <div className="bg-white min-h-screen text-black" ref={container}>
      <PortfolioHeader />
      
      <main className="flex-1 px-6 md:px-12 lg:px-20 container mx-auto pt-36 md:pt-48 pb-20">
        <section className="mb-20 md:mb-32">
          <p className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight max-w-3xl mb-6 text-black leading-relaxed fade-up-hero opacity-0">
            Construyamos algo increíble juntos.
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-[7.5vw] font-normal tracking-tight leading-[1.05] text-black fade-up-hero opacity-0">
            Contacto
          </h1>
        </section>
        
        <section className="pb-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="fade-up-content opacity-0">
            <h2 className="text-3xl font-normal tracking-tight mb-8">Información</h2>
            <div className="space-y-6 text-xl text-gray-600 font-light">
              <p>
                <a href="mailto:contmanuel77@gmail.com" className="hover:text-black transition-colors">
                  contmanuel77@gmail.com
                </a>
              </p>
              <p>CDMX, México</p>
              <div className="flex gap-6 pt-4">
                <a href="https://www.linkedin.com/in/manuel-herrera-perfil/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="fade-up-content opacity-0">
            <h2 className="text-3xl font-normal tracking-tight mb-8">Mándame un mensaje</h2>
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="w-full bg-gray-100 border-none rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400 font-light"
              />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="w-full bg-gray-100 border-none rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400 font-light"
              />
              <textarea 
                rows={5} 
                placeholder="¿Cómo te puedo ayudar?" 
                className="w-full bg-gray-100 border-none rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400 font-light resize-y"
              ></textarea>
              <button 
                type="submit" 
                className="bg-black text-white rounded-full px-8 py-4 text-lg font-normal hover:bg-gray-800 transition-colors w-max"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
