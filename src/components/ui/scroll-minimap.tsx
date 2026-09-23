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
      // Show minimap after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Determine active section
      let currentId = "";
      // Loop through items to find the one currently in view
      // We check from bottom to top so the first one that is above the middle of the screen wins
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the element is above the middle of the screen
          if (rect.top <= window.innerHeight * 0.5) {
            currentId = items[i].id;
            break;
          }
        }
      }
      
      // If we haven't reached the first project, don't highlight any
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
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 transition-opacity duration-500 ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group relative flex items-center justify-end py-2 cursor-pointer outline-none"
            aria-label={`Scroll to ${item.label}`}
          >
            {/* Tooltip */}
            <span className="absolute right-full mr-4 text-xs font-medium text-black bg-white shadow-sm border border-black/5 px-2.5 py-1 rounded-md opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
            
            {/* Line / Mark */}
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ease-out origin-right ${
                isActive 
                  ? "w-8 bg-black" 
                  : "w-3 bg-black/20 group-hover:w-6 group-hover:bg-black/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
