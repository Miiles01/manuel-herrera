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
    author: "David Jiménez",
    role: "Project Manager Assistant",
    image: "/assets/testimonials/testimonio-6.webp"
  },
  {
    text: "Tengo el gusto de estudiar y compartir algunas clases y proyectos escolares con Manuel durante nuestra formación en la carrera de Administración. Ha demostrado ser un gran estudiante, responsable, amigable y muy dedicado en lo que hace. Impacta por su gran creatividad en la creacion de post en redes sociales y por sus conocimientos en el área de Mercadotecnia. Recomiendo ampliamente a Manuel, será un gran aporte en cualquier organización y no tengo duda de que su ética de trabajo y actitud positiva lo llevaran muy lejos.",
    author: "María Marín",
    role: "Analista en Crédito y Cobranza at Office Depot México",
    image: "/assets/testimonials/testimonio-7.webp"
  }
];

const TESTIMONIALS_EN = [
  {
    text: "Manuel is a professional in every sense of the word, very passionate about his work, dedicated, and organized. Without a doubt, he makes incredible designs that exceed any brand's expectations.",
    author: "Ana Laura Garcia",
    role: "CEO at Naabi Kanabi",
    image: "/assets/testimonials/testimonio-1.webp"
  },
  {
    text: "Working with Manuel Herrera has been an exceptional experience. With an extremely creative approach, he managed to transform our abstract ideas into a solid and compelling identity for our company. His ability to understand the brand's core and translate it into visual elements is truly impressive. He is a professional who is passionate about what he does.",
    author: "Ricardo Alavez",
    role: "CEO at Miiles",
    image: "/assets/testimonials/testimonio-2.webp"
  },
  {
    text: "I had the opportunity to manage several digital marketing projects for renowned pharmaceutical brands with Manuel, and I can assure you he is an incredible professional. During our time working together, he demonstrated excellent creative skills and outstanding proactivity to resolve issues. Always willing to give his 100%, Manuel adds great value to the teams he collaborates with.",
    author: "Juan Pablo García",
    role: "Marketer at Pfizer",
    image: "/assets/testimonials/testimonio-3.webp"
  },
  {
    text: "Working with Manuel at Claro Pay was the best; his design skills allow him to generate creative solutions in very short times, and his proactivity accelerates objective fulfillment. He's very good at visual communication thanks to his designer's eye, an organized collaborator, and an autodidact who likes to stay up-to-date with industry trends.",
    author: "Leonardo Gama",
    role: "Product Manager at FonYou",
    image: "/assets/testimonials/testimonio-4.webp"
  },
  {
    text: "Working with Manuel on various marketing projects was a memorable experience. His creativity didn't just bring innovative ideas; it transformed entire strategies, achieving surprising results. He has a unique talent for identifying and leveraging trends before they go mainstream. If you're looking for someone with vision, initiative, and a fresh approach, Manuel is the one.",
    author: "Angelica Villanueva",
    role: "Executive Assistant at AM Seguridad",
    image: "/assets/testimonials/testimonio-5.webp"
  },
  {
    text: "I am lucky to work with Manuel, who is not only interested in generating results but also in building a close, long-term relationship with his collaborators and clients. He also has many skills that help brand growth, as well as improving scripts, which allowed us to work with major companies.",
    author: "David Jiménez",
    role: "Project Manager Assistant",
    image: "/assets/testimonials/testimonio-6.webp"
  },
  {
    text: "I had the pleasure of studying and sharing some classes and school projects with Manuel during our Business Administration studies. He proved to be a great student, responsible, friendly, and very dedicated to what he does. He impresses with his great creativity in social media posts and his Marketing knowledge. I highly recommend Manuel; he will be a great asset to any organization.",
    author: "María Marín",
    role: "Credit & Collection Analyst at Office Depot Mexico",
    image: "/assets/testimonials/testimonio-7.webp"
  }
];

export function Testimonials({ lang = "es" }: { lang?: "es" | "en" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((state) => (state + 1) % (lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS).length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setIndex((state) => (state + 1) % (lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS).length);
  const handlePrev = () => setIndex((state) => (state - 1 + (lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS).length) % (lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS).length);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 300, friction: 30, clamp: true },
    exitBeforeEnter: true,
  });

  return (
    <div className="flex flex-col w-full items-center gap-6">
      <div className="relative flex flex-col w-full bg-white rounded-[2.5vmin] max-sm:rounded-[24px] p-[4vmin] max-sm:p-[6vw] shadow-[0_1.5vmin_4vmin_rgba(60,30,90,0.08)] text-ink overflow-hidden">
      <a 
        href="https://www.linkedin.com/in/manuel-herrera-perfil/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-[3vmin] inline-flex self-start opacity-70 hover:opacity-100 hover:text-[#0A66C2] transition-colors"
        aria-label={lang === "en" ? "View LinkedIn profile" : "Ver perfil en LinkedIn"}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[3vmin] h-[3vmin] max-sm:w-8 max-sm:h-8">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <div className="relative h-[22vmin] max-sm:h-[38vmin] w-full flex items-center">
        {transitions((style, i) => {
          const arr = lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS;
          const item = arr[i];
          return (
            <animated.div style={style} className="absolute inset-0 flex flex-col justify-start">
              <p className="text-[2.1vmin] max-sm:text-[4vw] font-light leading-snug mb-[3vmin] opacity-90 line-clamp-4 max-sm:line-clamp-6">
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
                  <strong className="block text-[1.8vmin] max-sm:text-[3.5vw] font-medium leading-tight">{item.author}</strong>
                  <span className="text-[1.4vmin] max-sm:text-[3vw] opacity-70 leading-tight">{item.role}</span>
                </div>
              </div>
            </animated.div>
          );
        })}
      </div>
      <div className="absolute bottom-[4vmin] right-[4vmin] hidden z-10">
        <button onClick={handlePrev} className="p-[1vmin] rounded-full border border-ink/20 hover:bg-ink/5 transition-colors cursor-pointer pointer-events-auto">
          <svg width="2vmin" height="2vmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={handleNext} className="p-[1vmin] rounded-full border border-ink/20 hover:bg-ink/5 transition-colors cursor-pointer pointer-events-auto">
          <svg width="2vmin" height="2vmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
    {/* Mobile buttons outside */}
    <div className="sm:hidden flex items-center justify-center gap-6 mt-4 z-10 w-full">
      <button onClick={handlePrev} className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={handleNext} className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
    </div>
  );
}
