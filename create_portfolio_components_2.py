import os

# 4. PortfolioSkills.tsx
with open('src/components/portfolio/PortfolioSkills.tsx', 'w') as f:
    f.write("""'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PortfolioSkills() {
  const rootRef = useRef(null);

  useGSAP(() => {
    const container = rootRef.current.querySelector('.skills-container');
    const cardsContainer = rootRef.current.querySelector('.skills-cards');
    const cards = rootRef.current.querySelectorAll('.skills-card');
    
    if(!container || !cardsContainer) return;
    
    const distance = cardsContainer.clientWidth - window.innerWidth;
    const isPortrait = window.innerWidth < window.innerHeight;

    const scrollTween = gsap.to(cardsContainer, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: true,
            start: 'top top',
            end: '+=' + distance
        }
    });

    cards.forEach((card, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        const rotation = (Math.random() - 0.5) * 6;
        const amplitude = isPortrait ? 0.38 : 0.48;

        gsap.fromTo(card, {
            rotation: rotation
        }, {
            rotation: -rotation,
            y: () => sign * -amplitude * window.innerHeight,
            yPercent: () => sign * 50,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 90%',
                end: 'right 10%',
                scrub: true,
            }
        });
        
        gsap.to(card, {
            scale: 1.4,
            yoyo: true,
            repeat: 1,
            ease: 'back.inOut(3)',
            scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 90%',
                end: 'right 10%',
                scrub: true,
            }
        });
    });
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="mwg_effect094 bg-white text-black font-bold tracking-tighter relative z-20" style={{ overflow: 'hidden', position: 'relative' }}>
      <div className="skills-container flex flex-col justify-center w-full" style={{ height: '100vh' }}>
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[5vh] w-full whitespace-nowrap z-10 m-0 p-0">
            Mis Habilidades <span className="text-[#999]">Estrategia y Diseño</span>
          </p>
          <div className="skills-cards flex w-max whitespace-nowrap gap-[1vw] px-[105vw] items-center" style={{ willChange: 'transform' }}>
              {[
                "1640777", "1181675", "1181671", "1640774",
                "3183150", "3183153", "3182773", "3182781",
                "3182812", "3182829", "3182833", "3182834"
              ].map((id, index) => (
                <img 
                  key={index} 
                  className="skills-card relative w-[12vw] h-auto rounded-[0.5vw] aspect-square object-cover" 
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`} 
                  alt="" 
                />
              ))}
          </div>
      </div>
    </section>
  );
}
""")

# 5. PortfolioFooter.tsx
with open('src/components/portfolio/PortfolioFooter.tsx', 'w') as f:
    f.write("""'use client';
import { useRef } from 'react';
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
          <a href="/contacto.html" className="bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg md:text-xl hover:scale-105 transition-transform inline-flex items-center justify-center">
            Contactar
          </a>
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
""")

