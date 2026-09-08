import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Hero Animations — Two-Column Composition Sequence
 *
 * Sequence (fires once after preloaderDone === true):
 *  Step 1 (t=0.08s): Left Hero typography (heading, description, CTAs) reveals
 *                    via opacity, translateY(35px -> 0), and clip-path.
 *  Step 2 (t=1.00s): Left text settles.
 *  Step 3 (t=1.00s..1.80s): BREATHING DELAY (~0.8s pause).
 *  Step 4 (t=1.80s): Large transparent RedFort logo materializes on right (scale 0.85 -> 1, blur 15px -> 0, opacity 0 -> 1).
 *  Step 5 (t=1.90s): Soft red ambient radial gradient expands behind the logo.
 *  Step 6 (Scroll): ScrollTrigger parallax (left text drifts up, right logo scales & ambient glow shifts).
 *
 * Respects prefers-reduced-motion.
 */
export function useHeroAnimations(
  containerRef: React.RefObject<HTMLElement | null>,
  textGroupRef: React.RefObject<HTMLDivElement | null>,
  heroVisualRef: React.RefObject<HTMLDivElement | null>,
  imageGlowRef: React.RefObject<HTMLDivElement | null>,
  isReducedMotion: boolean,
  preloaderDone: boolean
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!preloaderDone) return;

    const container = containerRef.current;
    const textGroup = textGroupRef.current;
    const heroVisual = heroVisualRef.current;
    const imageGlow = imageGlowRef.current;

    if (!container || !textGroup || !heroVisual) return;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const ctx = gsap.context(() => {
      // ─── REDUCED MOTION: show everything immediately ────────────────────────
      if (isReducedMotion) {
        gsap.set([textGroup, heroVisual, imageGlow].filter(Boolean), {
          clearProps: "all",
        });
        return;
      }

      // ─── Query animatable children ──────────────────────────────────────────
      const heading = textGroup.querySelector<HTMLElement>(".hero-cin-heading");
      const description = textGroup.querySelector<HTMLElement>(".hero-cin-desc");
      const ctaRow = textGroup.querySelector<HTMLElement>(".hero-cin-cta");
      const featureRow = textGroup.querySelector<HTMLElement>(".hero-cin-features");

      // ─── INITIAL HIDDEN STATES ──────────────────────────────────────────────
      if (heading) {
        gsap.set(heading, {
          clipPath: "inset(0 0 100% 0)",
          y: 40,
          opacity: 0,
        });
      }
      if (description) {
        gsap.set(description, { y: 28, opacity: 0 });
      }
      if (ctaRow) {
        gsap.set(ctaRow, { y: 24, opacity: 0 });
      }
      if (featureRow) {
        gsap.set(featureRow, { y: 20, opacity: 0 });
      }

      // Large logo & ambient glow start hidden, scaled down and blurred
      gsap.set(heroVisual, {
        scale: 0.85,
        opacity: 0,
        filter: "blur(15px)",
        y: 20,
      });

      if (imageGlow) {
        gsap.set(imageGlow, { opacity: 0, scale: 0.7 });
      }

      // ─── ENTRANCE TIMELINE ──────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlRef.current = tl;

      // STEP 1 — Left Heading reveal
      if (heading) {
        tl.to(
          heading,
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.08
        );
      }

      // STEP 1b — Left Description reveal
      if (description) {
        tl.to(
          description,
          { y: 0, opacity: 1, duration: 0.85 },
          heading ? "-=0.6" : 0.08
        );
      }

      // STEP 1c — Left CTA buttons reveal
      if (ctaRow) {
        tl.to(
          ctaRow,
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.55"
        );
      }

      // STEP 1d — Feature tags reveal
      if (featureRow) {
        tl.to(
          featureRow,
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.5"
        );
      }

      // STEP 2 — INTENTIONAL BREATHING PAUSE (~0.8s delay after text settles)
      tl.addLabel("textSettled");
      tl.to({}, { duration: 0.8 }, "textSettled");

      // STEP 3 — Right Large RedFort Logo materializes smoothly
      tl.to(
        heroVisual,
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "+=0.05"
      );

      // STEP 4 — Red ambient gradient expands behind the logo
      if (imageGlow) {
        tl.to(
          imageGlow,
          {
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: "power2.out",
          },
          "<0.15"
        );
      }

      // ─── STEP 5 — SCROLL PARALLAX ──────────────────────────────────────────
      tl.call(() => {
        gsap.to(textGroup, {
          y: -50,
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(heroVisual, {
          y: -20,
          scale: 0.96,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, container);

    return () => {
      ctx.revert();
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloaderDone, isReducedMotion]);
}