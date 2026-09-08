import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium card reveal animation using GSAP ScrollTrigger.
 *
 * Replaces AOS fade-up for cards with a smoother premium effect:
 * - Slide upward from below (y: 60 → 0)
 * - Scale from 0.92 → 1
 * - Fade from opacity: 0 → 1
 * - Natural ease (power2.out)
 * - Stagger each card by 0.08s
 * - Reverses when scrolling back up
 * - Replays when scrolling down again (no once:true)
 * - GPU accelerated (force3D)
 *
 * Uses parent <section> as the ScrollTrigger so cards animate in/out
 * based on the section's viewport position, not each individual card.
 * This prevents premature reverse while the section is still visible.
 */
export function usePremiumCardReveal() {
  const location = useLocation();

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Select all cards that use the AOS fade-up attribute
    const cards = document.querySelectorAll<HTMLElement>("[data-aos='fade-up']");

    if (isReducedMotion) {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0, scale: 1, force3D: true });
      });
      return;
    }

    // Group cards by their parent section so the whole section acts as one trigger
    const sectionMap = new Map<HTMLElement, HTMLElement[]>();

    cards.forEach((card) => {
      // Prevent double initialization
      if (card.dataset.cardRevealed === "true") return;
      card.dataset.cardRevealed = "true";

      // Find the parent section to use as the trigger
      // This ensures cards stay visible while ANY part of the section is in viewport
      const section = card.closest("section") || card;

      if (!sectionMap.has(section)) {
        sectionMap.set(section, []);
      }
      sectionMap.get(section)!.push(card);
    });

    // Create one ScrollTrigger per section, animating all cards within it
    sectionMap.forEach((sectionCards, section) => {
      // Set initial state for all cards in this section
      gsap.set(sectionCards, { y: 60, opacity: 0, scale: 0.92, force3D: true });

      // Create a timeline that animates when the section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
        paused: true,
      });

      sectionCards.forEach((card) => {
        const delay = parseInt(card.getAttribute("data-aos-delay") || "0", 10) / 1000;

        tl.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay,
          force3D: true,
          overwrite: "auto",
        }, 0); // Start all card animations at same timeline time, delays handle stagger
      });
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    return () => {
      // ScrollTriggers are killed globally by useScrollAnimations on route change
    };
  }, [location.pathname]);
}
