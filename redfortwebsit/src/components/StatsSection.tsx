import { useEffect, useRef } from "react";
import { statistics as fallbackStatistics } from "../data/statistics";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  id: string;
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats?: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const displayedStats = stats?.length ? stats : fallbackStatistics;
  const sectionRef = useRef<HTMLDivElement>(null!);
  const svgPathRef = useRef<SVGPathElement>(null!);

  useEffect(() => {
    const section = sectionRef.current;
    const path = svgPathRef.current;
    if (!section || !path) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      // 1. Draw circuit line path on scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      // 2. Animate each stat number reveal & counter scale
      displayedStats.forEach((stat) => {
        const el = section.querySelector(`#stat-val-${stat.id}`);
        if (!el) return;

        const rawText = stat.value;
        const numMatch = rawText.match(/[\d.]+/);
        const targetNum = numMatch ? parseFloat(numMatch[0]) : null;
        const prefix = rawText.match(/^[^\d]+/)?.[0] || "";
        const suffix = rawText.replace(/^[^\d.]*/, "").replace(/[\d.]+/, "") || "";

        if (targetNum !== null && !isNaN(targetNum)) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: targetNum,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onUpdate: () => {
              const formattedVal =
                targetNum % 1 === 0
                  ? Math.round(counterObj.val)
                  : counterObj.val.toFixed(1);
              el.textContent = `${prefix}${formattedVal}${suffix}`;
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayedStats]);

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-20 border-y border-neutral-900 relative overflow-hidden"
    >
      {/* Background Red Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(211,47,47,0.06),transparent_70%)] pointer-events-none" />

      {/* SVG Circuit Path Connecting Stats Across Container */}
      <svg
        className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none z-0 hidden md:block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={svgPathRef}
          d="M 0 48 H 200 L 250 80 H 700 L 750 16 H 1200 L 1250 48 H 2000"
          stroke="#D32F2F"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-70 drop-shadow-[0_0_10px_rgba(211,47,47,0.8)]"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {displayedStats.map((stat, index) => (
            <div
              key={stat.id}
              className="relative p-6 rounded-2xl bg-neutral-950/80 border border-neutral-850/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-red-600/40 hover:shadow-[0_0_25px_rgba(211,47,47,0.25)] transition-all duration-300 group"
              id={stat.id}
            >
              {/* Circuit Junction Dot */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-red-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              </div>

              <div
                id={`stat-val-${stat.id}`}
                className="text-4xl lg:text-5xl font-sans font-black text-white tracking-tight mb-2 group-hover:text-red-600 transition-colors duration-300"
              >
                {stat.value}
              </div>
              <div className="text-[11px] lg:text-xs text-neutral-400 font-mono uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
