'use client';
import { useRef, useState } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function FooterCopyItem({ value, title, subtitle, copiedText = "{copiedText}" }: { value: string; title: string; subtitle: string; copiedText?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center relative cursor-pointer group" onClick={handleCopy}>
      <span className="text-white font-semibold mb-2 group-hover:text-gray-200 transition-colors">{title}</span>
      <span>{subtitle}</span>
      
      {/* Etiqueta de copiado (tooltip) */}
      <div 
        className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full pointer-events-none transition-all duration-300 ease-out shadow-lg ${
          copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {copiedText}
      </div>
    </div>
  );
}

export function PortfolioFooter({ lang = 'es' }: { lang?: 'es' | 'en' }) {
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
        
        <div className="flex flex-wrap justify-center items-start gap-12 md:gap-24 w-full text-gray-400 text-lg mb-12 text-center pt-8">
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold mb-2">{lang === 'en' ? 'Time zone' : 'Zona horaria'}</span>
            <span>{lang === 'en' ? 'Mexico City (GMT-6)' : 'Ciudad de México (GMT-6)'}</span>
          </div>
          
          <FooterCopyItem 
            value="+52 56 10168992" 
            title="+52 56 10168992" 
            subtitle={lang === 'en' ? 'Messaging' : 'Mensajería'} copiedText={lang === 'en' ? 'Copied' : 'Copiado'} 
          />

          <FooterCopyItem 
            value="contmanuel77@gmail.com" 
            title="contmanuel77@gmail.com" 
            subtitle="Email" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} 
          />

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
          <p className="text-white"><p className="text-white">&copy; 2026 Manuel Herrera. Todos los derechos reservados.</p>copy; 2026 Manuel Herrera. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
        </div>

      </div>
    </footer>
  );
}
