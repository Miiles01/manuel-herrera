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
  },
  {
    text: "Trabajar con Manuel en diversos proyectos de marketing fue una experiencia que dejó huella. Su creatividad no solo aportó ideas innovadoras, sino que transformó estrategias completas, logrando resultados sorprendentes. Tiene un talento único para identificar y aprovechar tendencias antes de que se vuelvan masivas, lo que lo convierte en un verdadero estratega del marketing. Si buscas a alguien con visión, iniciativa y un enfoque fresco, Manuel es la persona indicada.",
    author: "Angelica Villanueva",
    role: "Asistente Directivo at AM Seguridad",
    image: "/assets/testimonials/testimonio-5.webp"
  },
  {
    text: "Tengo la suerte de poder trabajar con Manuel, quien no solo está interesado en generar resultados, sino en establecer una relación estrecha a futuro con sus colaboradores y clientes. Además cuenta con muchas habilidades que ayudan al crecimiento de la marca, así como mejorar guiones lo que nos permitió trabajar con grandes compañías.",
    author: "David Martín Jiménez Viveros",
    role: "Project Manager Assistant",
    image: "/assets/testimonials/testimonio-6.webp"
  },
  {
    text: "Tengo el gusto de estudiar y compartir algunas clases y proyectos escolares con Manuel durante nuestra formación en la carrera de Administración. Ha demostrado ser un gran estudiante, responsable, amigable y muy dedicado en lo que hace. Impacta por su gran creatividad en la creacion de post en redes sociales y por sus conocimientos en el área de Mercadotecnia. Recomiendo ampliamente a Manuel, será un gran aporte en cualquier organización y no tengo duda de que su ética de trabajo y actitud positiva lo llevaran muy lejos.",
    author: "Compañera (Falta Nombre)",
    role: "Analista en Crédito y Cobranza at Office Depot México",
    image: "/assets/testimonials/testimonio-7.webp"
  }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((state) => (state + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setIndex((state) => (state + 1) % TESTIMONIALS.length);
  const handlePrev = () => setIndex((state) => (state - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 300, friction: 30, clamp: true },
    exitBeforeEnter: true,
  });

  return (
    <div className="relative flex flex-col w-full bg-white rounded-[2.5vmin] p-[4vmin] shadow-[0_1.5vmin_4vmin_rgba(60,30,90,0.08)] text-ink overflow-hidden">
      <h4 className="text-[1.8vmin] max-sm:text-[2.8vmin] font-medium tracking-wide opacity-70 mb-[3vmin]">
        Testimonios
      </h4>
      <div className="relative h-[32vmin] max-sm:h-[48vmin] w-full flex items-center">
        {transitions((style, i) => {
          const item = TESTIMONIALS[i];
          return (
            <animated.div style={style} className="absolute inset-0 flex flex-col justify-start">
              <p className="text-[2.1vmin] max-sm:text-[3.2vmin] font-light leading-snug italic mb-[3vmin] opacity-90 line-clamp-4 max-sm:line-clamp-5">
                "{item.text}"
              </p>
              <div className="mt-auto flex items-center gap-[2vmin]">
                {item.image ? (
                  <div className="relative size-[5vmin] max-sm:size-[8vmin] rounded-full overflow-hidden shrink-0 border border-ink/10 bg-black/5">
                    <Image src={item.image} alt={item.author} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="size-[5vmin] max-sm:size-[8vmin] rounded-full shrink-0 border border-ink/10 bg-black/5" />
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
      <div className="absolute bottom-[4vmin] right-[4vmin] flex gap-[1vmin] z-10">
        <button onClick={handlePrev} className="p-[1vmin] rounded-full border border-ink/20 hover:bg-ink/5 transition-colors">
          <svg width="2vmin" height="2vmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={handleNext} className="p-[1vmin] rounded-full border border-ink/20 hover:bg-ink/5 transition-colors">
          <svg width="2vmin" height="2vmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
