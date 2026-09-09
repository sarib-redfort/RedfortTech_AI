import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * AOS (Animate On Scroll) initialization hook.
 *
 * Handles ALL scroll-triggered animations across the ENTIRE website:
 * - Card reveal animations via existing data-aos attributes
 * - Explicit data-animate="heading" and data-animate="text" elements
 * - AUTO-DETECTS all h1-h4 and p elements NOT inside cards/hero/nav/buttons/forms
 *
 * Runs on EVERY route change so dynamically rendered content gets animated.
 * Config: replayable in both directions (once:false + mirror:true)
 */
export function useAOS() {
  const location = useLocation();

  useEffect(() => {
    // ----- STOP LIST: containers whose headings/paragraphs should NOT auto-animate -----
    const shouldSkip = (el: HTMLElement): boolean => {
      return !!el.closest(
        [
          // Hero section — handled by GSAP
          ".hero",
          "[data-hero]",
          // Navigation
          "nav",
          "header nav",
          // Interactive elements
          "button",
          "form",
          "[role='button']",
          // Cards — already have their own data-aos animations
          ".motion-card",
          "[class*='motion-card']",
          // Small utility badges/tags
          ".badge",
          ".tag",
          // Link-based card containers
          "a[class*='card']",
          "a[class*='group']",
        ].join(", ")
      );
    };

    // ----- 1. CONVERT explicit data-animate="heading" TO AOS -----
    document.querySelectorAll<HTMLElement>('[data-animate="heading"]').forEach((el) => {
      if (!el.dataset.aos) {
        el.dataset.aos = "fade-up";
        el.dataset.aosDuration = "850";
        el.dataset.aosOffset = "80";
        el.dataset.aosEasing = "ease-out-cubic";
      }
    });

    // ----- 2. CONVERT explicit data-animate="text" TO AOS -----
    document.querySelectorAll<HTMLElement>('[data-animate="text"]').forEach((el) => {
      if (!el.dataset.aos) {
        el.dataset.aos = "fade-up";
        el.dataset.aosDuration = "550";
        el.dataset.aosDelay = "100";
        el.dataset.aosOffset = "80";
        el.dataset.aosEasing = "ease-out-cubic";
      }
    });

    // ----- 3. AUTO-APPLY to ALL OTHER h1-h4 elements -----
    document.querySelectorAll<HTMLElement>("h1, h2, h3, h4").forEach((el) => {
      // Already has AOS or data-animate
      if (el.dataset.aos || el.dataset.animate) return;

      // Inside a skipped container
      if (shouldSkip(el)) return;

      // Empty/utility heading
      const text = el.textContent?.trim() || "";
      if (text.length < 4) return;

      el.dataset.aos = "fade-up";
      el.dataset.aosDuration = "850";
      el.dataset.aosOffset = "80";
      el.dataset.aosEasing = "ease-out-cubic";
    });

    // ----- 4. AUTO-APPLY to ALL OTHER p and blockquote elements -----
    document.querySelectorAll<HTMLElement>("p, blockquote, li > p").forEach((el) => {
      // Already has AOS or data-animate
      if (el.dataset.aos || el.dataset.animate) return;

      // Inside a skipped container
      if (shouldSkip(el)) return;

      // Tiny utility text
      const text = el.textContent?.trim() || "";
      if (text.length < 15) return;

      el.dataset.aos = "fade-up";
      el.dataset.aosDuration = "550";
      el.dataset.aosDelay = "100";
      el.dataset.aosOffset = "80";
      el.dataset.aosEasing = "ease-out-cubic";
    });

    // ----- 5. INIT AOS -----
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 80,
      throttleDelay: 50,
      debounceDelay: 50,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "phone" : false,
    });

    // Refresh after layout settles
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);
}