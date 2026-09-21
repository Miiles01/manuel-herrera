"use client";

import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import Image from "next/image";

const TESTIMONIALS = [
  {
    text: "Manu es un apasionado del marketing que siempre va un paso más allá. Trabajamos juntos en varios proyectos académicos y su capacidad para aportar valor y superar las expectativas fue una constante. Su dedicación, creatividad y enfoque en resultados lo distinguen de los demás. Recomiendo totalmente su perfil para cualquier reto profesional en el área comercial o de mercadotecnia.",
    author: "Marlen",
    role: "Especialista en Logística & Marketing Digital",
    image: "/assets/testimonials/testimonio-1.webp"
  },
  {
    text: "Su proceso de diseño y desarrollo es increíblemente fluido y los resultados hablan por sí solos. Llevó nuestra marca al siguiente nivel con una visión única.",
    author: "Cliente 2",
    role: "Founder, Startup"
  },
  {
    text: "Vibe coding en su máxima expresión. Entendió perfectamente lo que necesitábamos y superó nuestras expectativas.",
    author: "Cliente 3",
    role: "Marketing Manager"
  }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((state) => (state + 1) % TESTIMONIALS.length);
    }, 6000); // 6 seconds for longer reading time
    return () => clearInterval(timer);
  }, []);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, transform: "translateY(10px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-10px)" },
    config: { tension: 220, friction: 120 },
    exitBeforeEnter: true,
  });

  return (
    <div className="relative flex flex-col w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-[2.5vmin] p-[4vmin] shadow-sm text-paper overflow-hidden">
      <h4 className="text-[1.8vmin] max-sm:text-[2.8vmin] font-medium tracking-wide uppercase opacity-70 mb-[3vmin]">
        Testimonios
      </h4>
      <div className="relative h-[22vmin] max-sm:h-[35vmin] w-full flex items-center">
        {transitions((style, i) => {
          const item = TESTIMONIALS[i];
          return (
            <animated.div style={style} className="absolute inset-0 flex flex-col justify-start">
              <p className="text-[1.8vmin] max-sm:text-[2.8vmin] font-light leading-snug italic mb-[3vmin] opacity-90 line-clamp-4">
                "{item.text}"
              </p>
              <div className="mt-auto flex items-center gap-[2vmin]">
                {item.image ? (
                  <div className="relative size-[5vmin] max-sm:size-[8vmin] rounded-full overflow-hidden shrink-0 border border-white/30 bg-black/10">
                    <Image src={item.image} alt={item.author} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="size-[5vmin] max-sm:size-[8vmin] rounded-full shrink-0 border border-white/30 bg-white/10" />
                )}
                <div className="flex flex-col">
                  <strong className="block text-[1.8vmin] max-sm:text-[2.6vmin] font-medium leading-tight">{item.author}</strong>
                  <span className="text-[1.4vmin] max-sm:text-[2.2vmin] opacity-70 leading-tight">{item.role}</span>
                </div>
              </div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
}
