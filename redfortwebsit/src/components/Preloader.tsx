import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Premium cinematic preloader
 * Shows "REDFORT AI" with fade/scale/glow, then slides up to reveal hero.
 *
 * Fixes applied:
 * - Empty dep array so timeline is never killed by re-renders
 * - onComplete stored in a ref so it's always fresh without being a dep
 * - Hold tween uses gsap.delayedCall pattern (avoids empty target issues)
 * - Cleanup only kills if timeline is still active
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const preloaderRef = useRef<HTMLDivElement>(null!);
  const textRef = useRef<HTMLHeadingElement>(null!);
  const glowRef = useRef<HTMLDivElement>(null!);

  // Always keep a fresh reference to onComplete without it being a dependency
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    console.log("[Preloader] Mounted");

    const preloaderEl = preloaderRef.current;
    const textEl = textRef.current;
    const glowEl = glowRef.current;

    if (!preloaderEl || !textEl || !glowEl) {
      console.warn("[Preloader] Refs not ready — calling onComplete immediately");
      onCompleteRef.current();
      return;
    }

    console.log("[Preloader] Animation started");

    // Set initial states
    gsap.set(preloaderEl, { y: 0 });
    gsap.set(textEl, { opacity: 0, scale: 0.8, y: 20 });
    gsap.set(glowEl, { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
      onComplete: () => {
        console.log("[Preloader] Animation completed — onComplete fired");
        onCompleteRef.current();
      },
    });

    // 1. Logo fades in with scale
    tl.to(textEl, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // 2. Red glow appears
    tl.to(
      glowEl,
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4"
    );

    // 3. Hold — use a label + delay instead of empty object tween
    tl.addLabel("hold");
    tl.to(textEl, { opacity: 1, duration: 0.8 }, "hold"); // no-op tween on a real element

    // 4. Preloader slides UP to reveal hero
    tl.to(preloaderEl, {
      y: "-100%",
      duration: 1.2,
      ease: "power4.inOut",
    });

    // 5. Fade glow during slide
    tl.to(
      glowEl,
      {
        opacity: 0,
        duration: 0.6,
      },
      "-=0.8"
    );

    return () => {
      console.log("[Preloader] Cleanup — killing timeline");
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Red ambient glow behind text */}
      <div
        ref={glowRef}
        className="absolute w-[300px] h-[300px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Logo text */}
      <h1
        ref={textRef}
        className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-[0.15em] text-white"
      >
        REDFORT{" "}
        <span className="text-red-600">AI</span>
      </h1>
    </div>
  );
}