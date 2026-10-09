"use client";

import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, forwardRef } from "react";
import { usePageTransition } from "@/hooks/use-page-transition";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ children, href, className, ...props }, ref) {
  const pathname = usePathname();
  const router = useRouter();
  const startTransition = usePageTransition((s) => s.startTransition);

  // Warm the destination as soon as the visitor shows intent (hover / focus), so
  // by the click its route is ready and the page transition starts right away
  // instead of freezing on the old page while the route loads.
  const warm = () => {
    if (href.startsWith("/") && href !== pathname) router.prefetch(href);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    
    // Only intercept local links that don't open in a new tab
    const target = (e.currentTarget as HTMLAnchorElement).target;
    if (target === "_blank") return;
    if (href.startsWith("#")) return;
    
    e.preventDefault();
    startTransition(href);
  };

  return (
    <Link ref={ref} href={href} onClick={handleClick} onMouseEnter={warm} onFocus={warm} className={className} {...props}>
      {children}
    </Link>
  );
});
