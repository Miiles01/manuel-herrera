/**
 * Image reveal for page navigations.
 *
 * After a route change the new page's images start hidden and each one fades
 * up into place as soon as IT has loaded — a slow image never holds back the
 * rest of the page, and text keeps its own entrance animations. Images already
 * in the cache reveal in a short stagger once the page transition has landed;
 * lazy images further down reveal whenever they finish loading (usually as the
 * visitor scrolls to them). Images that arrive later (client-rendered lists)
 * are picked up by a MutationObserver for the lifetime of the page.
 *
 * Motion runs on the Web Animations API (compositor-only: opacity + transform),
 * like the page transition it accompanies — see ADR-0025 in decisions-log.md.
 */

const RISE_PX = 32;
const DURATION_MS = 900;
const STAGGER_MS = 75;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // ease-out-quint: quick start, soft landing

const HANDLED = "imgReveal";

function hide(img: HTMLImageElement) {
  img.style.opacity = "0";
  img.style.transform = `translateY(${RISE_PX}px)`;
}

function show(img: HTMLImageElement, delay = 0) {
  const anim = img.animate(
    [
      { opacity: 0, transform: `translateY(${RISE_PX}px)` },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: DURATION_MS, delay, easing: EASE, fill: "both" },
  );
  anim.onfinish = () => {
    // Hand the element back to its own styles (hover zooms etc.).
    img.style.opacity = "";
    img.style.transform = "";
    anim.cancel();
  };
}

/** Elements inside `root` that should not be touched (e.g. the loader). */
const SKIP = "[data-no-reveal]";

/**
 * Hide every image under `root` now; returns `start`, which reveals them —
 * loaded ones in a stagger, the rest as each finishes loading — and keeps
 * watching for images added later. `start` returns a cleanup function.
 */
export function prepareImageReveal(root: ParentNode = document) {
  const pending: HTMLImageElement[] = [];

  const claim = (img: HTMLImageElement) => {
    if (img.dataset[HANDLED] || img.closest(SKIP)) return false;
    img.dataset[HANDLED] = "1";
    hide(img);
    pending.push(img);
    return true;
  };

  root.querySelectorAll("main img").forEach((n) => claim(n as HTMLImageElement));

  return function start(): () => void {
    let i = 0;
    const reveal = (img: HTMLImageElement, staggered: boolean) => {
      if (img.complete && img.naturalWidth > 0) {
        show(img, staggered ? STAGGER_MS * i++ : 0);
      } else {
        const onDone = () => show(img);
        img.addEventListener("load", onDone, { once: true });
        // A broken image still shouldn't stay invisible.
        img.addEventListener("error", onDone, { once: true });
      }
    };
    pending.splice(0).forEach((img) => reveal(img, true));

    // Images rendered after the navigation (client lists, carousels…).
    const main = document.querySelector("main");
    if (!main) return () => {};
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const imgs = node instanceof HTMLImageElement ? [node] : [...node.querySelectorAll("img")];
          imgs.forEach((img) => {
            if (claim(img)) reveal(img, false);
          });
        });
      }
      pending.length = 0;
    });
    observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  };
}
