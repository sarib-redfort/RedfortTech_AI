import { Link } from "react-router-dom";

interface TierBadgeCardProps {
  badgeLabel?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
}

export function TierBadgeCard({
  badgeLabel = "ENTERPRISE CERTIFIED",
  title = "RedFort Tier-1 AI Architecture",
  description = "Autonomous agent orchestration with SOC2 Type II compliance, sub-50ms inference latency, and custom domain-fine-tuned local models.",
  linkUrl = "/services",
}: TierBadgeCardProps) {
  return (
    <section className="bg-black text-white py-20 border-b border-neutral-900 relative overflow-hidden flex justify-center">
      {/* Ambient Red Center Glow — REDUCED BY 10% */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-red-600/13 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        <div
          data-aos="fade-up"
          className="red-glow-card rounded-3xl p-8 md:p-12 border border-neutral-800 bg-neutral-950/90 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
        >
          {/* ── ENTERPRISE CERTIFIED ROTATING VISUAL WITH FIXED CENTER LOGO 2 ── */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 flex items-center justify-center select-none pointer-events-none">
            {/* Ambient Pulse Glow Behind Geometry */}
            <div className="absolute inset-0 bg-red-600/18 rounded-full blur-2xl animate-pulse pointer-events-none" />

            {/* 1. OUTER ROTATING VISUAL — 3D Faceted Geometric Crystal (Rotates Continuously) */}
            <svg
              className="w-full h-full text-red-600 animate-[spin_30s_linear_infinite] transition-all duration-700 pointer-events-none"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="100,10 180,60 180,140 100,190 20,140 20,60" stroke="#D32F2F" strokeWidth="2.5" fill="rgba(211,47,47,0.08)" />
              <polygon points="100,10 180,60 100,100" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" fill="rgba(255,255,255,0.05)" />
              <polygon points="100,10 20,60 100,100" stroke="#D32F2F" strokeWidth="1.5" fill="rgba(211,47,47,0.15)" />
              <polygon points="20,60 20,140 100,100" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />
              <polygon points="180,60 180,140 100,100" stroke="#D32F2F" strokeWidth="1.5" fill="rgba(211,47,47,0.2)" />
              <polygon points="20,140 100,190 100,100" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
              <polygon points="180,140 100,190 100,100" stroke="#D32F2F" strokeWidth="1.5" fill="rgba(211,47,47,0.25)" />
            </svg>

            {/* 2. CENTER LOGO 2 — FIXED IN THE EXACT CENTER (Increased width +1px, height +3px) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <img
                src="/assets/logos/logo 2.png"
                alt="RedFort AI"
                className="w-[57px] h-[59px] sm:w-[65px] sm:h-[67px] md:w-[81px] md:h-[83px] object-contain drop-shadow-[0_0_12px_rgba(211,47,47,0.4)]"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-red-600 uppercase font-bold">
                {badgeLabel}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight">
              {title}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed font-body">
              {description}
            </p>

            <div className="pt-2">
              <Link
                to={linkUrl}
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 hover:text-white transition-colors group-hover:translate-x-1 duration-300"
              >
                <span>LEARN MORE ABOUT TIER-1 AI</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
