import re

with open('index.html', 'r') as f:
    html = f.read()

# Fix CSS
css_old = r"""    \.mwg_effect105 {
        padding: 10vh 0 60vh 0;
        overflow: hidden;
    }
    \.mwg_effect105 li {
        opacity: 0\.35;
    }
    \.mwg_effect105 \.medias {
        position: fixed;
        top: calc\(50% - 5vw\);
        left: 5%;
        width: 15\.5vw;
        height: 10vw;
        z-index: 50;
    }
    \.mwg_effect105 \.medias img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
    }"""
css_new = """    .mwg_effect105 {
        padding: 50vh 0;
        overflow: hidden;
    }
    .mwg_effect105 li {
        opacity: 0.35;
        padding: 1.5rem 0; /* Replace gap with padding to avoid dead zones */
    }
    .mwg_effect105 .medias {
        position: fixed;
        top: 50%;
        left: 5%;
        transform: translateY(-50%);
        height: 10vw;
        aspect-ratio: 1.55;
        z-index: 50;
    }
    .mwg_effect105 .medias img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
    }"""
html = re.sub(css_old, css_new, html)

# Fix HTML (Remove gap-12 so we use padding instead)
html = html.replace('ul class="flex flex-col gap-12', 'ul class="flex flex-col')

# Fix JS
js_old = r"""      function updateMedia105\(\) {
          let closestIndex = -1;
          let closestDist = Infinity;

          items105\.forEach\(\(item, i\) => {
              const rect = item\.getBoundingClientRect\(\);
              const dist = Math\.abs\(rect\.top \+ rect\.height / 2 - centerY105\);
              if \(dist < closestDist\) {
                  closestDist = dist;
                  closestIndex = i;
              }
          }\);

          if \(closestIndex !== currentIndex105\) {
              gsap\.set\(medias105, { visibility: "visible", autoAlpha: 1 }\);
              gsap\.fromTo\(medias105, {
                  scale: 1\.1
              }, {
                  scale: 1,
                  rotation: 0,
                  duration: 0\.3,
                  ease: "back\.out\(2\)"
              }\);
              items105\.forEach\(\(item, i\) => {
                  gsap\.set\(item, { autoAlpha: i === closestIndex \? 1 : 0\.35 }\);
              }\);
              mediaImgs105\.forEach\(\(img, i\) => {
                  gsap\.set\(img, { visibility: i === closestIndex \? "visible" : "hidden" }\);
              }\);
              currentIndex105 = closestIndex;
          }
      }"""

js_new = """      function updateMedia105() {
          let closestIndex = -1;
          let closestDist = Infinity;

          items105.forEach((item, i) => {
              const rect = item.getBoundingClientRect();
              // Original logic: only detect if center is within the item
              if (centerY105 < rect.top || centerY105 > rect.bottom) return;

              const dist = Math.abs(rect.top + rect.height / 2 - centerY105);
              if (dist < closestDist) {
                  closestDist = dist;
                  closestIndex = i;
              }
          });

          if (closestIndex !== currentIndex105 && closestIndex !== -1) {
              gsap.fromTo(medias105, { scale: 1.1 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2)" });
              items105.forEach((item, i) => {
                  gsap.set(item, { autoAlpha: i === closestIndex ? 1 : 0.35 });
              });
              mediaImgs105.forEach((img, i) => {
                  gsap.set(img, { visibility: i === closestIndex ? "visible" : "hidden" });
              });
              currentIndex105 = closestIndex;
          } else if (closestIndex === -1 && currentIndex105 !== -1) {
              // Hide if outside bounds
              mediaImgs105.forEach((img) => gsap.set(img, { visibility: "hidden" }));
              items105.forEach((item) => gsap.set(item, { autoAlpha: 0.35 }));
              currentIndex105 = -1;
          }
      }"""
html = re.sub(js_old, js_new, html)

with open('index.html', 'w') as f:
    f.write(html)
