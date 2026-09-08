import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight Red Scaling Path Line
 *
 * Positioned directly underneath "Who We Are", before "Services".
 * Completely clean: NO tags, NO pills, NO labels, NO text.
 * Scroll-driven SVG path drawing tied to user scroll progress.
 */
export function ScalingLine() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const pathRef = useRef<SVGPathElement>(null!);
  const glowPathRef = useRef<SVGPathElement>(null!);

  useEffect(() => {
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const length = path.getTotalLength();
    
    // Set initial dasharray & dashoffset to hide line completely
    gsap.set([path, glowPath].filter(Boolean), {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      // Scrubbed line drawing tied directly to user scroll progress
      gsap.to([path, glowPath].filter(Boolean), {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 30%",
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-8 md:py-12 bg-black overflow-hidden flex justify-center items-center pointer-events-none border-t border-b border-neutral-900/60"
    >
      {/* Background Soft Red Glow Ambient Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[140px] bg-red-600/10 blur-[110px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="relative w-full h-24 md:h-36">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Blurred Red Glow Path */}
            <path
              ref={glowPathRef}
              d="M 0 120 C 200 155, 300 15, 500 90 C 700 165, 800 10, 1000 35"
              stroke="#D32F2F"
              strokeWidth="8"
              strokeLinecap="round"
              className="opacity-40 filter blur-md"
            />
            {/* Primary Sharp Red Path Line */}
            <path
              ref={pathRef}
              d="M 0 120 C 200 155, 300 15, 500 90 C 700 165, 800 10, 1000 35"
              stroke="#D32F2F"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(211,47,47,0.9)] opacity-95"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
