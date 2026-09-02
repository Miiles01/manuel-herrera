'use client';
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
