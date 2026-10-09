"use client";

import { useEffect, useState } from "react";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

interface MinimapItem {
  id: string;
  label: string;
}

export function ScrollMinimap({ items }: { items: MinimapItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      let currentId = "";
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            currentId = items[i].id;
            break;
          }
        }
      }
      
      if (currentId) {
        setActiveId(currentId);
      } else if (items.length > 0) {
        const firstEl = document.getElementById(items[0].id);
        if (firstEl && firstEl.getBoundingClientRect().top < window.innerHeight) {
           setActiveId(items[0].id);
        } else {
           setActiveId("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const lenis = useScroll.getState().lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -50, duration: 1.2 });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-[150%] opacity-0 pointer-events-none"
      }`}
    >
      {/* Contenedor: width es "hug" (w-max), borde cuadrado con redondeo tipo navbar (rounded-2xl) */}
      <div className="group/menu relative flex flex-col items-end gap-3 py-4 px-3 rounded-2xl bg-gray-50/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-max">
        
        {items.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full flex items-center justify-end gap-3 cursor-pointer outline-none group/btn"
              aria-label={`Scroll to ${item.label}`}
            >
              {/* Label opens like the navbar menu (after Haven): its column grows to
                  the label's real width (grid 0fr → 1fr, 0.5s), and the text rises
                  from below its clipped edge (0.6s long ease), 40ms apart per row.
                  Opens on hover and on keyboard focus. */}
              <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/menu:grid-cols-[1fr] group-focus-within/menu:grid-cols-[1fr]">
                <span className="min-w-0 overflow-hidden">
                  <span
                    className="block translate-y-[110%] whitespace-nowrap pl-1 text-right text-base font-medium text-gray-400 transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0,1)] group-hover/menu:translate-y-0 group-focus-within/menu:translate-y-0 group-hover/btn:text-black"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    {item.label}
                  </span>
                </span>
              </span>

              {/* Línea / Marcador (siempre visible a la derecha) */}
              <span
                className={`h-[3px] rounded-full shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive 
                    ? "w-6 bg-black" 
                    : "w-2 bg-gray-300 group-hover/btn:bg-gray-400 group-hover/btn:w-4"
                }`}
              />
            </button>
          );
        })}

      </div>
    </div>
  );
}
