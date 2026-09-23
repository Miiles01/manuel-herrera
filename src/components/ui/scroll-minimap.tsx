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
      // Aparece al bajar 100px
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
    handleScroll(); // init
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
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-12"
      }`}
    >
      {/* Contenedor tipo "churro" / pill */}
      <div className="group/menu relative flex flex-col items-end gap-3 py-5 px-3 rounded-[32px] bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-[40px] hover:w-[220px] overflow-hidden">
        
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full flex items-center justify-end gap-4 cursor-pointer outline-none group/btn"
              aria-label={`Scroll to ${item.label}`}
            >
              {/* Texto (solo visible al expandir el contenedor) */}
              <span 
                className="text-sm font-medium text-gray-400 group-hover/btn:text-black whitespace-nowrap opacity-0 group-hover/menu:opacity-100 transition-all duration-500 ease-out translate-x-4 group-hover/menu:translate-x-0"
              >
                {item.label}
              </span>
              
              {/* Línea / Marcador (siempre visible) */}
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
