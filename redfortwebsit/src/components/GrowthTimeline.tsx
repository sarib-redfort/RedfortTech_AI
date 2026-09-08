import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle } from "./SectionTitle";

gsap.registerPlugin(ScrollTrigger);

interface GrowthTimelineProps {
  subtitle?: string;
  title?: string;
}

export function GrowthTimeline({
  subtitle = "STORYTELLING & GROWTH",
  title = "And How It All {Started & Scaled}",
}: GrowthTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const pathRef = useRef<SVGPathElement>(null!);
  const floatDotRef = useRef<HTMLDivElement>(null!);

  const milestones = [
    { year: "2020", title: "Inception & Core R&D", stat: "$1.2M AI Capital", detail: "Formed core ML research cell specializing in autonomous agent reasoning." },
    { year: "2022", title: "Enterprise Scaling", detail: "Expanded enterprise SLA stack across North American financial and health hubs." },
    { year: "2024", title: "Global Expansion", stat: "99.99% Guaranteed SLA", detail: "Deployed SOC2 certified multi-region autonomous clusters for global Fortune 500s." },
    { year: "PRESENT", title: "Next-Gen AI Stack", stat: "$400M+ Value Generated", detail: "Leading full-stack AI transformation with sub-50ms latency architecture." },
  ];

  useEffect(() => {
    const path = pathRef.current;
    const dot = floatDotRef.current;
    if (!path || !containerRef.current) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
          onUpdate: (self) => {
            if (dot && path) {
              const point = path.getPointAtLength(self.progress * length);
              gsap.to(dot, {
                x: point.x,
                y: point.y,
                duration: 0.1,
                ease: "power1.out",
              });
            }
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-black text-white py-28 border-b border-neutral-900 relative overflow-hidden"
    >
      {/* Background Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6">
            <SectionTitle
              subtitle={subtitle}
              title={title}
              light
            />
          </div>
          <div className="lg:col-span-6 text-neutral-400 text-sm md:text-base leading-relaxed font-body">
            RedFort AI was built to solve the fundamental friction between raw machine learning research and high-stakes enterprise reliability. We turn complex data pipelines into{" "}
            <span className="text-red-600 font-bold drop-shadow-[0_0_10px_rgba(211,47,47,0.6)]">
              autonomous, self-healing digital systems
            </span>{" "}
            that compound value 24/7.
          </div>
        </div>

        {/* Animated Wavy Line-Chart SVG Path with Drifting Floating Metrics */}
        <div className="relative w-full h-48 md:h-64 my-8">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={pathRef}
              d="M 0 160 C 200 180, 300 40, 500 120 C 700 200, 800 20, 1000 40"
              stroke="#D32F2F"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(211,47,47,0.9)]"
            />
          </svg>

          {/* Floating Metric Dot traveling along scroll path */}
          <div
            ref={floatDotRef}
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_20px_#D32F2F] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
            <div className="mt-2 px-3 py-1 bg-black/90 border border-red-600 rounded-full text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-[0_0_15px_rgba(211,47,47,0.5)]">
              REDFORT SCALING PATH
            </div>
          </div>
        </div>

        {/* Milestone Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 80}
              className="red-glow-card rounded-2xl p-6 border border-neutral-850 bg-neutral-950 flex flex-col justify-between group hover:border-red-600/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-sans font-black text-red-600">
                    {m.year}
                  </span>
                  {m.stat ? (
                    <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-mono text-neutral-300 font-bold">
                      {m.stat}
                    </span>
                  ) : null}
                </div>
                <h4 className="text-base font-sans font-bold text-white mb-2">
                  {m.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-body">
                  {m.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center gap-2 text-[10px] font-mono text-red-600 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <span>MILESTONE METRIC</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
