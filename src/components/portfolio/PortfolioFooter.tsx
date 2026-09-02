'use client';
import { useRef } from 'react';
import { TransitionLink } from "@/components/ui/transition-link";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PortfolioFooter() {
  const footerRef = useRef(null);

  useGSAP(() => {
    const footerText = new SplitType('#footer-hablemos', { types: 'chars' });
    gsap.set(footerText.chars, { yPercent: 100 });

    gsap.to(footerText.chars, {
      yPercent: 0,
      stagger: { each: 0.05, from: "random" },
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '#footer-hablemos',
        start: 'top 90%',
      }
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-gradient-to-b from-[#FFFFFF] to-[#F8F9FD] py-24 md:py-32 px-8 md:px-12 overflow-hidden relative z-0">
      <div className="w-full flex flex-col relative z-10 mix-blend-difference text-white">
        
        <div className="flex justify-between items-center w-full mb-16 md:mb-24">
          <p className="text-2xl md:text-4xl font-medium tracking-tight text-left">Trabajemos juntos</p>
          <TransitionLink href="/contacto" className="bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-full font-semibold text-lg md:text-xl hover:scale-105 transition-transform inline-flex items-center justify-center">
            Contactar
          </TransitionLink>
        </div>
        
        <div className="flex flex-wrap justify-center items-start gap-12 md:gap-24 w-full text-gray-400 text-lg mb-12 text-center">
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold mb-2">Zona horaria</span>
            <span>Ciudad de México</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold mb-2">+52 56 10168992</span>
            <span className="text-sm">solo para mensajes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold mb-2">Email</span>
            <a href="mailto:contmanuel77@gmail.com" className="hover:text-white transition-colors">contmanuel77@gmail.com</a>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold mb-2">Social</span>
            <a href="https://www.linkedin.com/in/manuel-herrera-perfil/" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
        
        <div className="w-full flex justify-center mb-16">
          <h2 id="footer-hablemos" className="text-[34vw] font-medium leading-none tracking-tighter text-center w-full" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}>
            Manu
          </h2>
        </div>

        <div className="w-full flex justify-center text-gray-400 text-sm text-center">
          <p className="text-white">&copy; 2026 Manuel Herrera. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
}
