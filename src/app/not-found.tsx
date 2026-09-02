"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";

export default function NotFound() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.utils.toArray(".fade-up").forEach((el: any, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, ease: "power3.out" }
      );
    });
  }, { scope: container });

  return (
    <div className="bg-white min-h-screen text-black flex flex-col" ref={container}>
      <PortfolioHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-48 pb-32">
        <h1 className="text-8xl md:text-[12vw] font-normal tracking-tighter leading-none mb-6 text-black fade-up opacity-0">
          Ups.
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-500 mb-12 max-w-lg fade-up opacity-0">
          Algo salió mal o la página que estás buscando no existe.
        </p>
        <div className="fade-up opacity-0">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center bg-black text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-800 hover:scale-105 transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
