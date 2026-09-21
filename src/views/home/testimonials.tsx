"use client";

import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import Image from "next/image";

const TESTIMONIALS = [
  {
    text: "Manu es un apasionado del marketing que siempre va un paso más allá. Trabajamos juntos en varios proyectos académicos y su capacidad para aportar valor y superar las expectativas fue una constante. Su dedicación, creatividad y enfoque en resultados lo distinguen de los demás. Recomiendo totalmente su perfil para cualquier reto profesional en el área comercial o de mercadotecnia.",
    author: "Marlene Rodriguez",
    role: "Especialista en Logística & Marketing Digital",
    image: "/assets/testimonials/testimonio-1.webp"
  },
  {
    text: "Trabajar con Manuel no solamente fue compartir trabajos universitarios dentro de clase, sino también fue compartir visión. Es de esas personas que no solo hacen su parte, sino que elevan el estándar de todo el equipo. Tiene una habilidad única para convertir ideas sueltas en acciones con impacto real, y lo hace con una naturalidad que inspira. Ya sea resolviendo problemas en tiempo récord o proponiendo nuevas formas de hacer las cosas, Manuel siempre está un paso adelante. Si buscas a alguien que combine inteligencia práctica, creatividad, sensatez y una vibra auténticamente profesional, no busques más.",
    author: "Armando García",
    role: "Brand Associate Mental Health at IFA Celtics",
    image: "/assets/testimonials/testimonio-2.webp"
  },
  {
    text: "Tuve la oportunidad de conocer a Manuel en la universidad, y desde entonces ha sido evidente su enfoque a resultados, su inteligencia y su pasión por el marketing. Es de esas personas que no solo destacan por su conocimiento, sino por la manera en que lo aplican con propósito y estrategia. Manuel tiene un talento excepcional para el branding: entiende cómo construir marcas con significado, conecta con las personas desde lo emocional y sabe cómo traducir ideas en ejecuciones poderosas. Es inspirador, claro en su comunicación y siempre propositivo. Además de su capacidad profesional, es una gran persona: comprometido, colaborativo y con una calidad humana que lo convierte en un colega que todos quieren tener cerca. Estoy seguro de que será un activo valioso en cualquier equipo o proyecto en el que participe.",
    author: "Juan Pablo García",
    role: "Marketer at Pfizer",
    image: "/assets/testimonials/testimonio-3.webp"
  },
  {
    text: "Trabajar con Manuel fue de lo mejor en Claro Pay, su habilidad en el diseño le permite generar soluciones creativas en tiempos muy cortos, y su pro actividad acelera el cumplimiento de objetivos. Muy bueno comunicando visualmente gracias a su ojo de diseñador, un colaborador organizado, y un autodidacta que le gusta estar al tanto de las tendencias y novedades de la industria.",
    author: "Leonardo Gama",
    role: "Product Manager at FonYou",
    image: "/assets/testimonials/testimonio-4.webp"
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
      <div className="relative h-[40vmin] max-sm:h-[60vmin] w-full flex items-center">
        {transitions((style, i) => {
          const item = TESTIMONIALS[i];
          return (
            <animated.div style={style} className="absolute inset-0 flex flex-col justify-start">
              <p className="text-[1.8vmin] max-sm:text-[2.8vmin] font-light leading-snug italic mb-[3vmin] opacity-90 line-clamp-[12]">
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
