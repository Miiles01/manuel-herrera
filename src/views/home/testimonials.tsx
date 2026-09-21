"use client";

import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";

const DUMMY_TESTIMONIALS = [
  {
    text: "Manuel es un crack. Llevó nuestra marca al siguiente nivel con una visión única.",
    author: "Cliente 1",
    role: "CEO, Empresa"
  },
  {
    text: "Su proceso de diseño y desarrollo es increíblemente fluido y los resultados hablan por sí solos.",
    author: "Cliente 2",
    role: "Founder, Startup"
  },
  {
    text: "Vibe coding en su máxima expresión. Entendió perfectamente lo que necesitábamos.",
    author: "Cliente 3",
    role: "Marketing Manager"
  }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((state) => (state + 1) % DUMMY_TESTIMONIALS.length);
    }, 4000);
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
    <div className="relative flex flex-col w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl p-[4vmin] shadow-sm text-paper">
      <h4 className="text-[1.8vmin] font-medium tracking-wide uppercase opacity-70 mb-[2vmin]">
        Testimonios
      </h4>
      <div className="relative h-[15vmin] w-full flex items-center">
        {transitions((style, i) => {
          const item = DUMMY_TESTIMONIALS[i];
          return (
            <animated.div style={style} className="absolute inset-0 flex flex-col justify-center">
              <p className="text-[2.2vmin] font-light leading-snug italic mb-[2vmin]">
                "{item.text}"
              </p>
              <div>
                <strong className="block text-[1.8vmin] font-medium">{item.author}</strong>
                <span className="text-[1.5vmin] opacity-70">{item.role}</span>
              </div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
}
