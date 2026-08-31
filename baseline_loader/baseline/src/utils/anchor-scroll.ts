import type { MouseEvent } from "react";

import { scrollTo } from "@/utils/scroll-to";

/**
 * Click handler for in-page anchor links (`href="#section"`). Prevents the
 * native jump and drives a Lenis-aware smooth scroll to the target id. External
 * or non-hash links fall through untouched. Pass `onDone` to e.g. close a menu.
 */
export const anchorScroll =
  (href: string, onDone?: () => void) =>
  (event: MouseEvent<HTMLElement>) => {
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    onDone?.();
    scrollTo(id);
  };
