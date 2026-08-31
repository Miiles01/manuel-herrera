document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("intro-loader");
    const loaderGreeting = document.getElementById("loader-greeting");
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('cossette-loader/');

    // 1. ANIMACIÓN DE ENTRADA (Subpáginas)
    // index.html tiene su propia lógica en finishLoader()
    if (!isIndex && loader) {
        // Nos aseguramos que inicie tapando la pantalla
        gsap.set(loader, { yPercent: 0 });
        if (loaderGreeting) gsap.set(loaderGreeting, { autoAlpha: 0 }); // Mantener limpio el telón en subpáginas

        // Esperamos a que cargue la ventana y levantamos el telón
        window.addEventListener('load', () => {
            gsap.to(loader, {
                yPercent: -100,
                duration: 0.85,
                ease: 'power3.inOut',
                delay: 0.1
            });
        });
        
        // Fallback por si carga muy rápido o falla
        setTimeout(() => {
            gsap.to(loader, {
                yPercent: -100,
                duration: 0.85,
                ease: 'power3.inOut'
            });
        }, 1500);
    }

    // 2. ANIMACIÓN DE SALIDA (Para todas las páginas al hacer clic en un link)
    const links = document.querySelectorAll("a");
    
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetUrl = link.getAttribute("href");
            const targetStr = targetUrl ? targetUrl.toLowerCase() : "";
            
            // Queremos interceptar links internos que sean a otra página HTML 
            // O a la misma página (ej. logo a index.html)
            const isInternalHtml = targetStr.includes(".html") || (!targetStr.startsWith("http") && !targetStr.startsWith("mailto") && !targetStr.startsWith("#"));

            // Excepciones: abrir en otra pestaña
            const isBlank = link.getAttribute("target") === "_blank";

            if (targetUrl && isInternalHtml && !isBlank && loader) {
                e.preventDefault();
                
                // Si había barra de progreso, la mostramos llena o vacía (mejor esconderla para transiciones rápidas)
                if (loaderGreeting) gsap.set(loaderGreeting, { autoAlpha: 0 });

                // Bajar el loader para tapar la pantalla
                gsap.to(loader, {
                    yPercent: 0,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onComplete: () => {
                        // Navegar a la siguiente página
                        window.location.href = targetUrl;
                    }
                });
            }
        });
    });
});

// 3. FIX PARA BROWSER BACK BUTTON (Bfcache)
// Si el usuario usa el botón de "Atrás" en su navegador, el DOM se carga desde caché 
// con el loader abajo. Esto asegura que lo levantemos.
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        const loader = document.getElementById("intro-loader");
        if (loader) {
            gsap.set(loader, { yPercent: -100 });
        }
    }
});
