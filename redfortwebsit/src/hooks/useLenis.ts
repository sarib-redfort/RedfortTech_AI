import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scrolling hook - Production-ready
 * Properly synchronized with GSAP ScrollTrigger
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with production settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // CRITICAL: Connect Lenis to ScrollTrigger
    // This tells ScrollTrigger to update whenever Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // Connect GSAP ticker to Lenis RAF loop
    // This ensures GSAP animations stay in sync with Lenis
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.add(gsap.updateRoot);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}