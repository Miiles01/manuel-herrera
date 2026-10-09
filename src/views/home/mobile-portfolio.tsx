"use client";
import { TransitionLink } from "@/components/ui/transition-link";
import type { ShowreelContent } from "@/data/mocks/home";

/**
 * Phones only (`sm:hidden`): a plain, white, scroll-only version of the home —
 * no pinned stage, no star. Featured projects as an image list, then the
 * experience ("Piensa diferente" + roles). The testimonials CTA section is
 * shared with desktop and follows this in home.tsx.
 */
export const MobilePortfolio = ({ content, lang = "es" }: { content: ShowreelContent; lang?: "es" | "en" }) => {
  return (
    <div className="sm:hidden w-full bg-white">
      <section aria-label={lang === "en" ? "Featured projects" : "Proyectos destacados"} className="flex flex-col px-4 pt-12 pb-16">
        <h2 className="ml-2 mb-8 mt-8 text-4xl font-medium tracking-tight text-sphere-ink">
          {lang === "en" ? "Featured projects" : "Proyectos destacados"}
        </h2>

        <div className="flex w-full flex-col gap-6">
          {content.portfolio.items.map((item) => {
            const href = item.slug ? (lang === "en" ? `/en/project/${item.slug}` : `/es/proyecto/${item.slug}`) : null;
            const card = (
              <>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 size-full object-cover object-center"
                  />
                )}
                <div className="relative z-[2] flex size-full flex-col justify-end gap-1">
                  <h3 className="m-0 text-2xl font-normal leading-[1.05] tracking-[-0.02em]">{item.title}</h3>
                </div>
              </>
            );
            const cls = "relative flex w-full aspect-[4/3] overflow-hidden rounded-[24px] p-6 text-white";
            return href ? (
              <TransitionLink key={item.title} href={href} className={`${cls} block cursor-pointer`}>
                {card}
              </TransitionLink>
            ) : (
              <div key={item.title} className={cls}>{card}</div>
            );
          })}
        </div>
      </section>

      <section aria-label={lang === "en" ? "Experience" : "Experiencia"} className="flex flex-col gap-8 px-6 pt-8 pb-8 text-sphere-ink">
        <h2 className="m-0 flex flex-col text-4xl font-medium leading-[1.05] tracking-tight">
          {content.sphere.headingBottom.map((line, i) => (
            <span key={i} className={i === 1 ? "opacity-40" : undefined}>{line}</span>
          ))}
        </h2>
        <div className="flex flex-col gap-5 text-[15px] font-light leading-[1.45]">
          {content.sphere.body.map((para, i) => (
            <p key={i} className="m-0" dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </section>
    </div>
  );
};
