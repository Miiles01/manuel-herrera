'use client';
import { useState } from 'react';
import { TransitionLink } from "@/components/ui/transition-link";

export function PortfolioHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Logo (Izquierda) */}
      <div className="fixed top-8 left-4 md:left-12 z-50 mix-blend-difference pointer-events-none mt-2 md:mt-3">
        <TransitionLink href="/" className="font-normal text-white text-xl md:text-2xl tracking-tighter pointer-events-auto hover:opacity-75 transition-opacity block">
          Manuel Herrera
        </TransitionLink>
      </div>

      {/* Botón Hablemos (Derecha Extrema) */}
      <div className="fixed top-8 right-4 md:right-12 z-50 mix-blend-difference pointer-events-none mt-3 md:mt-4 hidden md:block">
        <TransitionLink href="/contacto" className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          Hablemos
        </TransitionLink>
      </div>

      {/* Contenedor del Menú Desplegable (Navbar) */}
      <div className={`fixed top-8 right-4 md:right-[140px] z-50 bg-gray-50/90 backdrop-blur-sm w-[calc(100vw-2rem)] md:w-[420px] rounded-md pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${isMenuOpen ? 'max-h-[600px]' : 'max-h-[60px]'}`}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-6 h-[60px] w-full flex justify-between items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <span className="text-sm font-medium">{isMenuOpen ? 'Cerrar' : 'Menú'}</span>
          <div className="flex flex-col gap-1.5 w-8 relative">
            <div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}></div>
            <div className={`h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[-3.5px] -rotate-45' : ''}`}></div>
          </div>
        </button>

        <nav className={`flex flex-col gap-6 px-8 pt-6 pb-12 text-2xl font-semibold text-gray-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
          <TransitionLink href="/" className="hover:text-gray-500 transition-colors">Inicio</TransitionLink>
          <TransitionLink href="/trabajo" className="hover:text-gray-500 transition-colors">Trabajo</TransitionLink>
          <TransitionLink href="/contacto" className="hover:text-gray-500 transition-colors">Contacto</TransitionLink>
        </nav>
      </div>
    </>
  );
}
