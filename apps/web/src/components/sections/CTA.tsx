import { Link } from "react-router-dom";
import { LucideIcon } from "../ui/LucideIcon";

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function CTA({
  title = "Ready to Transform Your Enterprise Stack?",
  description = "Deploy autonomous AI agents, sub-50ms model pipelines, and high-security digital solutions crafted by RedFort's elite engineering squad.",
  buttonText = "GET STARTED TODAY"
}: CTAProps) {
  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-t border-neutral-900 flex justify-center">
      {/* Dynamic Red Radar Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[160px] rounded-full pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 w-full">
        {/* Centered Logo Icon Inside Concentric Pulsing Glowing Red Radar Rings */}
        <div className="relative w-28 h-28 mx-auto mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-red-600/60 animate-radar-ring-1 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-red-600/40 animate-radar-ring-2 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-red-600/20 animate-radar-ring-3 pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-neutral-950 border-2 border-red-600 shadow-[0_0_18px_rgba(211,47,47,0.45)] flex items-center justify-center relative z-10">
            <img
              src="/assets/logos/logo.png"
              alt="RedFort AI Logo"
              className="h-8 w-auto object-contain px-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.2em] text-red-600 uppercase font-bold">
              JOIN THE REDFORT NETWORK
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight max-w-4xl mx-auto text-white">
            {title}
          </h2>

          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-body">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 bg-red-600 hover:bg-red-600/90 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase px-9 py-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(211,47,47,0.3)] hover:shadow-[0_0_24px_rgba(211,47,47,0.5)] hover:scale-105"
            >
              <span>{buttonText}</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link>

            <Link
              to="/about"
              className="group relative inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/50 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase px-9 py-4 rounded-full transition-all duration-300 hover:bg-white/5 hover:scale-105"
            >
              <span>WANT TO JOIN US</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

