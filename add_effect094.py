import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Insert CSS
css_code = """
    .mwg_effect094 {
        overflow: hidden;
        position: relative;
    }
    .mwg_effect094 .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
        width: 100%;
    }
    .mwg_effect094 .container p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-size: 5vh;
    }
    .mwg_effect094 .container p span {
        color: #999;
    }
    .mwg_effect094 .cards {
        display: flex;
        width: max-content;
        white-space: nowrap;
        gap: 1vw;
        will-change: transform;
        padding: 0 105vw;
        align-items: center;
    }
    .mwg_effect094 .card {
        position: relative;
        width: 12vw;
        height: auto;
        border-radius: 0.5vw;
    }
"""
content = content.replace('  </style>', css_code + '  </style>')

# 2. Insert HTML
html_code = """
  <!-- Habilidades (Effect 094) -->
  <section class="mwg_effect094 bg-white text-black font-bold tracking-tighter">
      <div class="container">
          <p>Mis Habilidades <span>Estrategia y Diseño</span></p>
          <div class="cards">
              <img class="card" src="https://picsum.photos/id/10/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/20/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/30/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/40/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/50/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/60/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/70/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/80/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/90/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/100/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/110/600/600" alt="">
              <img class="card" src="https://picsum.photos/id/120/600/600" alt="">
          </div>
      </div>
  </section>
"""
content = content.replace('  <!-- Mis trabajos -->', html_code + '\n  <!-- Mis trabajos -->')

# 3. Insert JS
js_code = """
    // Efecto 094 (Habilidades)
    {
      const root = document.querySelector('.mwg_effect094')
      if (root) {
        const container = root.querySelector('.container')
        const cardsContainer = root.querySelector('.cards')
        const cards = root.querySelectorAll('.card')
        const distance = cardsContainer.clientWidth - window.innerWidth
        const isPortrait = window.innerWidth < window.innerHeight

        const scrollTween = gsap.to(cardsContainer, {
            x: - distance,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: true,
                start: 'top top',
                end: '+=' + distance
            }
        })

        cards.forEach((card, i) => {
            const sign = i % 2 === 0 ? 1 : -1
            const rotation = (Math.random() - 0.5) * 6
            const amplitude = isPortrait ? 0.38 : 0.48

            gsap.fromTo(card, {
                rotation: rotation
            }, {
                rotation: -rotation,
                y: () => sign * -amplitude * window.innerHeight,
                yPercent: () => sign * 50,
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: 'left 90%',
                    end: 'right 10%',
                    scrub: true,
                }
            })
            gsap.to(card, {
                scale: 1.4,
                yoyo: true,
                repeat: 1,
                ease: 'back.inOut(3)',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: 'left 90%',
                    end: 'right 10%',
                    scrub: true,
                }
            })
        })
      }
    }
"""
content = content.replace('  </script>', js_code + '\n  </script>')

with open('index.html', 'w') as f:
    f.write(content)
