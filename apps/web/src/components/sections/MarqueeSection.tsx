import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeSectionProps {
  text?: string;
}

export function MarqueeSection({
  text = "REDFORT AI • AUTONOMOUS INTELLIGENCE • SCALABLE ARCHITECTURES • FUTURE READY STACK • ",
}: MarqueeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const marqueeInnerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const marquee = marqueeInnerRef.current;
    if (!marquee) return;

    // Continuous infinite automatic movement — half original speed, no scroll dependency
    const tween = gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      duration: 60,
      ease: "none",
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Repeat text twice for a seamless infinite loop track
  const marqueeText = (text + " ").repeat(6);

  return (
    <section
      ref={containerRef}
      className="bg-black py-5 md:py-7 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center min-h-[108px] md:min-h-[126px]"
    >
      {/* Subtle Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[80px] bg-red-600/4 blur-[80px] rounded-full pointer-events-none z-0" />

      {/* 3D Twisted Ribbon / Helix Graphic Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="helixRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#D32F2F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M 0 160 C 360 40, 720 280, 1080 80 C 1260 -20, 1380 220, 1440 160 C 1380 100, 1260 300, 1080 180 C 720 20, 360 260, 0 160 Z"
          fill="url(#helixRed)"
        />
      </svg>

      {/* Giant Marquee Text Track */}
      <div className="w-full overflow-hidden whitespace-nowrap relative z-10 select-none pointer-events-none">
        <div
          ref={marqueeInnerRef}
          className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neutral-700 via-white to-red-600 opacity-90 uppercase"
        >
          {marqueeText}
        </div>
      </div>
    </section>
  );
}
