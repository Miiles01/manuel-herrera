  <script>

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);


    // 1. Iniciar Lenis para scroll inercial suave
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2
    })
    
    // Forzar a Lenis a iniciar desde arriba
    lenis.scrollTo(0, { immediate: true });

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("osmo-ease","0.625, 0.05, 0, 1");

    // 2. Preparar los textos del Hero (Ocultarlos inmediatamente para evitar FOUC)
    const heroText = new SplitType('#hero-name', { types: 'chars' });
    gsap.set(heroText.chars, { yPercent: 100 });

    const introText = new SplitType('#intro-text', { types: 'lines, words' });
    // Crear la máscara de desborde en cada línea
    introText.lines.forEach(line => {
      line.style.overflow = 'hidden';
      // Ajuste para evitar recortes en la parte inferior de letras como la 'g'
      line.style.paddingBottom = '0.2em';
      line.style.marginBottom = '-0.2em';
    });
    gsap.set(introText.words, { yPercent: 110 });

    // 3. Lógica Funcional del Loader (Espera a que carguen los assets)
    lenis.stop(); // Detener el scroll mientras carga
    
    // 3.1 Falso progreso de carga inicial (hasta el 70%)
    const progressTween = gsap.to('#loader-progress', {
      scaleX: 0.7,
      duration: 2,
      ease: 'power2.out',
      paused: false
    });

    // 3.3 Función para culminar el loader y revelar la página
    let isLoaded = false;
    const finishLoader = () => {
      if (isLoaded) return;
      isLoaded = true;

      const tlExit = gsap.timeline({
        onComplete: () => {
          lenis.start(); // Reactivar scroll
          // Desatar la animación del texto gigante "Manu"
          gsap.to(heroText.chars, {
            yPercent: 0,
            stagger: { each: 0.05, from: "random" },
            duration: 0.8,
            ease: "power2.out",
          });
          // Desatar la animación del texto introductorio estilo Osmo
          gsap.to(introText.words, {
            yPercent: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "osmo-ease"
          });
        }
      });

      // Llenar la barra al 100% rápidamente
      tlExit.to('#loader-progress', {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      // Levantar el telón
      .to('#intro-loader', {
        yPercent: -100,
        duration: 0.85,
        ease: 'power3.inOut'
      });
    };

    // 3.4 Escuchar el evento real de carga
    if (document.readyState === 'complete') {
      // Si por alguna razón cargó instantáneamente
      setTimeout(finishLoader, 800); 
    } else {
      window.addEventListener('load', finishLoader);
      // Fallback de seguridad (máximo 4 segundos) para que el usuario no se quede atrapado si falla una imagen
      setTimeout(finishLoader, 4000);
    }

    // 3.5 Parallax del Hero (Efecto "Tapar")
    // Al hacer scroll, la palabra "Manu" baja más lento de lo normal, dejando que la imagen superior suba y la cubra.
    gsap.to('#hero-content', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 4. Expansión y Parallax de la imagen Gris
    gsap.to('#scrub-container', {
      width: '100%',
      height: '100vh',
      borderRadius: '0px',
      ease: 'none',
      scrollTrigger: {
        trigger: '#scrub-container',
        start: 'top 90%', // Empieza a abrirse apenas entra
        end: 'top 10%',   // Termina de abrirse casi arriba
        scrub: true
      }
    });

    // 5. Animación tipo "Manu" para la palabra "Hablemos." en el footer
    const footerText = new SplitType('#footer-hablemos', { types: 'chars' });
    gsap.set(footerText.chars, { yPercent: 100 });

    gsap.to(footerText.chars, {
      yPercent: 0,
      stagger: { each: 0.05, from: "random" },
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '#footer-hablemos',
        start: 'top 90%',
      }
    });
    gsap.fromTo('#scrub-image', 
      { yPercent: -20 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scrub-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );



    // 5. Lógica del Menú
    const menuBtn = document.getElementById('menu-btn');
    const menuContainer = document.getElementById('menu-container');
    const menuLinks = document.getElementById('menu-links');
    const menuText = document.getElementById('menu-text');
    const line1 = document.getElementById('line-1');
    const line2 = document.getElementById('line-2');
    let isMenuOpen = false;

    if(menuBtn) {
      menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
          menuContainer.classList.remove('max-h-[50px]');
          menuContainer.classList.add('max-h-[600px]');
          menuLinks.classList.remove('opacity-0');
          menuLinks.classList.add('opacity-100', 'delay-100');
          
          menuText.textContent = 'Cerrar';
          line1.style.transform = 'translateY(3.5px) rotate(15deg)';
          line2.style.transform = 'translateY(-3.5px) rotate(-15deg)';
        } else {
          menuContainer.classList.remove('max-h-[600px]');
          menuContainer.classList.add('max-h-[50px]');
          menuLinks.classList.remove('opacity-100', 'delay-100');
          menuLinks.classList.add('opacity-0');
          
          menuText.textContent = 'Menú';
          line1.style.transform = 'translateY(0) rotate(0)';
          line2.style.transform = 'translateY(0) rotate(0)';
        }
      });
    }



  
    // Efecto 105 (Habilidades)
    const root105 = document.querySelector(".mwg_effect105");
    if(root105) {
      const container105 = root105.querySelector("ul");
      const medias105 = root105.querySelector(".medias");
      
      const tempImages = [
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542744094-24638ea0b347?q=80&w=600&auto=format&fit=crop"
      ];
      medias105.innerHTML = tempImages.map(url => `<img src="${url}" alt="Skill">`).join("");
      
      const mediaImgs105 = medias105.querySelectorAll("img");
      const items105 = container105.querySelectorAll("li");
      const offset105 = container105.clientWidth * 0.26;

      items105.forEach(item => {
          const tl = gsap.timeline({
              scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.3
              }
          });
          tl.to(item, {
              x: offset105,
              duration: 1,
              ease: "power1.inOut"
          });
          tl.to(item, {
              x: 0,
              duration: 1,
              ease: "power1.inOut"
          });
      });

      let currentIndex105 = -1;
      const centerY105 = window.innerHeight / 2;

      function updateMedia105() {
          let closestIndex = 0;
          let closestDist = Infinity;

          items105.forEach((item, i) => {
              const rect = item.getBoundingClientRect();
              const dist = Math.abs(rect.top + rect.height / 2 - centerY105);
              if (dist < closestDist) {
                  closestDist = dist;
                  closestIndex = i;
              }
          });

          if (closestIndex !== currentIndex105) {
              gsap.fromTo(medias105, { scale: 1.1 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2)" });
              items105.forEach((item, i) => {
                  gsap.set(item, { autoAlpha: i === closestIndex ? 1 : 0.35 });
              });
              mediaImgs105.forEach((img, i) => {
                  gsap.set(img, { visibility: i === closestIndex ? "visible" : "hidden" });
              });
              currentIndex105 = closestIndex;
          }
      }

      ScrollTrigger.create({
          trigger: root105,
          start: "top bottom",
          end: "bottom top",
          onUpdate: updateMedia105
      });
      updateMedia105();
    }</script>
