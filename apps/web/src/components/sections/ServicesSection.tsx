import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SectionTitle } from "../ui/SectionTitle";
import { LucideIcon } from "../ui/LucideIcon";
import { MotionCard } from "../ui/MotionCard";
import { getImageUrl, fetchAllPages } from "../../lib/api";
import type { Service } from "../../types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logger } from '../../lib/logger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ServicesSectionProps {
  limit?: number;
  showTitle?: boolean;
  useCaseStudyStyle?: boolean;
}

// ─────────────────────────────────────────────
// Helpers  (untouched CMS normalisation)
// ─────────────────────────────────────────────
function normalizeService(item: any): Service {
  return {
    id: item?.id || item?._id || item?.slug || item?.title || "",
    title: item?.title || "",
    description:
      item?.description ||
      item?.longDescription ||
      item?.shortDescription ||
      "",
    icon: item?.icon || "Cpu",
    status: item?.status,
    slug: item?.slug || "",
    image: item?.image ? getImageUrl(item.image) : undefined,
  };
}

function extractServiceList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.success && Array.isArray(payload?.data)) return payload.data;
  return [];
}

function getPlainDescription(description?: string) {
  if (!description) return "";
  return description
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function ServicesSection({
  showTitle = true,
  useCaseStudyStyle = false,
}: ServicesSectionProps) {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Refs for pinning – only the card grid, NOT the heading
  const cardExperienceRef = useRef<HTMLDivElement>(null!);
  const detailRef = useRef<HTMLDivElement>(null!);
  const stRef = useRef<ScrollTrigger | null>(null);

  // ── Fetch CMS services (unchanged) ──────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = await fetchAllPages("/services");
        const list = extractServiceList(payload).map(normalizeService);
        if (alive) setServices(list);
      } catch (e) {
        logger.error("ServicesSection fetch:", e);
        if (alive) { setError("Failed to load services."); setServices([]); }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ── Derived values ─────────────────────────────────────────
  const totalServices = services.length;
  const hasMoreThan4 = totalServices > 4;
  // Home shows max 4; dedicated Services page shows all
  const displayServices = useCaseStudyStyle ? services : services.slice(0, 4);
  const activeService = displayServices[activeStep] ?? displayServices[0];

  // ── GSAP ScrollTrigger – pins ONLY the card experience area ─
  const buildScrollTrigger = useCallback(() => {
    if (useCaseStudyStyle || !cardExperienceRef.current) return;

    const isMobile = window.innerWidth < 1024;

    // Kill existing instance first
    stRef.current?.kill();
    stRef.current = null;

    const steps = Math.min(displayServices.length, 4);
    if (steps < 1) return;

    if (isMobile) return; // natural scroll on mobile/tablet < 1024

    // Each service step gets ~55vh of scroll distance → compact journey
    const scrollDistance = steps * 55;

    stRef.current = ScrollTrigger.create({
      trigger: cardExperienceRef.current,
      start: "top 80px",           // pin starts when CARD AREA top hits 80px from viewport top
      end: `+=${scrollDistance}vh`,
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      onUpdate(self) {
        const raw = self.progress * steps;
        const idx = Math.min(steps - 1, Math.floor(raw));
        setActiveStep(idx);

        // subtle scale pulse on the detail card
        if (detailRef.current) {
          const pulse = 1 + Math.sin(self.progress * Math.PI) * 0.015;
          gsap.set(detailRef.current, { scale: pulse });
        }
      },
      onLeave() {
        setActiveStep(steps - 1);
      },
      onEnterBack() {
        setActiveStep(0);
      },
    });
  }, [displayServices.length, useCaseStudyStyle]);

  useEffect(() => {
    if (loading || useCaseStudyStyle) return;
    if (displayServices.length === 0) return;

    buildScrollTrigger();

    // Rebuild on resize so mobile/desktop breakpoint switches correctly
    const onResize = () => {
      buildScrollTrigger();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [loading, displayServices.length, useCaseStudyStyle, buildScrollTrigger]);

  // ── Animate detail card on active step change ────────────────
  useEffect(() => {
    if (!detailRef.current || useCaseStudyStyle) return;
    gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [activeStep, useCaseStudyStyle]);

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <section
      className="bg-black text-white border-b border-neutral-900 relative overflow-hidden"
      style={{ paddingTop: showTitle ? "5rem" : "4rem", paddingBottom: "4rem" }}
    >
      {/* Ambient glow — desktop & mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/8 blur-[180px] rounded-full pointer-events-none z-0" />
      {/* Mobile-specific red ambient glow layers — ensures red visual language on small viewports */}
      <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="lg:hidden absolute bottom-0 right-0 w-[200px] h-[200px] bg-red-600/8 blur-[80px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

        {/* ── Heading & paragraph — NEVER pinned ─────────────────── */}
        {showTitle && (
          <div className="mb-10 max-w-2xl">
            <SectionTitle
              subtitle="HOW IT WORKS / OUR SERVICES"
              title="Autonomous Software {& AI Integration Workflow}"
              light
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-800 border-t-red-600 rounded-full animate-spin" />
            <p className="mt-4 text-xs font-mono text-neutral-400 uppercase tracking-widest">
              Loading Enterprise Services...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-neutral-950 border border-red-600/40 p-8 rounded-2xl text-center text-red-600 font-mono text-sm">
            {error}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            A) CASE STUDY GRID — used on the dedicated /services page
        ══════════════════════════════════════════════════════ */}
        {!loading && !error && useCaseStudyStyle && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv, idx) => (
              <MotionCard
                key={srv.id}
                className="red-glow-card rounded-3xl border border-neutral-850 bg-neutral-950 overflow-hidden group cursor-pointer flex flex-col justify-between hover:border-red-600/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(211,47,47,0.25)]"
                data-aos="fade-up"
                data-aos-delay={idx * 90}
                onClick={() => navigate(`/services/${srv.slug || srv.id}`)}
                id={`service-card-${srv.id}`}
              >
                {/* Card image / icon header */}
                <div className="h-56 relative overflow-hidden bg-neutral-950 flex items-center justify-center">
                  {srv.image ? (
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 blur-2xl rounded-full pointer-events-none group-hover:bg-red-600/30 transition-all duration-500" />
                      <LucideIcon
                        name={srv.icon || "Cpu"}
                        className="w-14 h-14 text-red-600 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 drop-shadow-[0_0_20px_rgba(211,47,47,0.7)]"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="inline-block text-[10px] font-mono bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-2 shadow-[0_0_12px_#D32F2F]">
                      SERVICE MODULE
                    </span>
                    <h3 className="text-xl font-sans font-black text-white group-hover:text-red-600 transition-colors leading-tight">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="p-5 bg-neutral-950 flex justify-between items-center border-t border-neutral-900 flex-grow">
                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 max-w-[80%] font-body">
                    {getPlainDescription(srv.description)}
                  </p>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shrink-0 shadow-[0_0_12px_rgba(211,47,47,0.3)]">
                    <LucideIcon name="ArrowUpRight" className="w-4 h-4" />
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            B) CINEMATIC HOME EXPERIENCE
               • Heading / paragraph are ABOVE this block (normal scroll)
               • THIS block is what gets pinned
        ══════════════════════════════════════════════════════ */}
        {!loading && !error && !useCaseStudyStyle && displayServices.length > 0 && (
          <div>
            {/* Step counter badge */}
            <div className="flex items-center gap-2 mb-4" style={{ transform: "translateY(-4px)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#D32F2F]" />
              <span className="text-[10px] font-mono text-red-600 uppercase tracking-[0.3em] font-bold">
                SERVICE {String(activeStep + 1).padStart(2, "0")} / {String(displayServices.length).padStart(2, "0")}
              </span>
            </div>

            {/* ── PINNED CARD EXPERIENCE ────────────────────────── */}
            <div
              ref={cardExperienceRef}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch
                         bg-neutral-950/70 backdrop-blur-sm
                         p-5 rounded-2xl border border-neutral-900
                         shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                         [background:linear-gradient(145deg,#080808_0%,rgba(13,13,13,0.95)_60%,rgba(211,47,47,0.04)_100%)]"
            >

              {/* LEFT — Compact 4-card numbered list */}
              <div className="lg:col-span-5 flex flex-col gap-[18px]" style={{ transform: "translateY(10px)" }}>
                {displayServices.map((srv, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setActiveStep(idx)}
                      className={`
                        w-full text-left flex items-center gap-3 px-4 pt-[calc(0.75rem+3px)] pb-[calc(0.75rem+3px)] rounded-xl border
                        transition-all duration-300 cursor-pointer
                        ${isActive
                          ? "bg-neutral-900 border-red-600 shadow-[0_0_20px_rgba(211,47,47,0.25)]"
                          : "bg-neutral-950/60 border-neutral-850 hover:border-neutral-700 opacity-55 hover:opacity-80"
                        }
                      `}
                    >
                      {/* Step number badge */}
                      <span
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          font-mono font-bold text-xs shrink-0 transition-colors
                          ${isActive
                            ? "bg-red-600 text-white shadow-[0_0_10px_#D32F2F]"
                            : "bg-neutral-900 text-neutral-500"
                          }
                        `}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Title + short description */}
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-sans font-bold truncate transition-colors ${isActive ? "text-white" : "text-neutral-500"}`}>
                          {srv.title}
                        </p>
                        {isActive && (
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1 font-body">
                            {getPlainDescription(srv.description)}
                          </p>
                        )}
                      </div>

                      {/* Icon */}
                      <LucideIcon
                        name={srv.icon || "Cpu"}
                        className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-red-600" : "text-neutral-700"}`}
                      />
                    </button>
                  );
                })}

                {/* EXPLORE ALL — only when CMS has > 4 services */}
                {hasMoreThan4 && (
                  <Link
                    to="/services"
                    className="
                      mt-1 w-full text-center group relative inline-flex items-center justify-center gap-2
                      bg-black border border-white/15 hover:border-red-600 hover:bg-red-600/10
                      text-white font-mono text-[10px] font-bold tracking-[0.2em] uppercase
                      px-4 py-2.5 rounded-xl transition-all duration-300
                      shadow-[0_0_10px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(211,47,47,0.5)]
                    "
                  >
                    <span>EXPLORE ALL</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                )}
              </div>

              {/* RIGHT — Active Service Detail Card (balanced height with list) */}
              <div className="lg:col-span-7 flex flex-col">
                <div
                  ref={detailRef}
                  className="
                    flex-1 bg-neutral-950 border border-neutral-850 rounded-2xl
                    px-5 md:px-6 pt-5 pb-6 md:pt-6 md:pb-8
                    shadow-[0_20px_50px_rgba(0,0,0,0.95)]
                    relative overflow-hidden red-glow-card flex flex-col justify-between
                    transition-all duration-500 will-change-transform
                    [background:linear-gradient(160deg,#0d0d0d_0%,#080808_70%,rgba(211,47,47,0.05)_100%)]
                  "
                >
                  {/* Red ambient spotlight */}
                  <div className="absolute -top-10 -right-10 w-52 h-52 bg-red-600/18 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600/10 blur-[45px] rounded-full pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-neutral-800/60 pb-4 mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      {/* PLACE 2: Small RedFort logo / monogram replaced with logo 2 */}
                      <div className="p-2 bg-neutral-900 border border-red-600/30 rounded-xl shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(211,47,47,0.2)]">
                        <img src="/assets/logos/logo 2.png" alt="RedFort AI Monogram" className="w-5 h-5 object-contain" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] block mb-0.5">
                          Service Overview
                        </span>
                        <h3 className="text-base md:text-lg font-sans font-extrabold text-white leading-tight tracking-tight">
                          {activeService?.title}
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-neutral-900/80 border border-red-600/20 rounded-full text-[9px] font-mono text-red-600 uppercase tracking-widest font-bold shrink-0 mt-0.5">
                      {String(activeStep + 1).padStart(2, "0")} / {String(displayServices.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="relative z-10 flex-grow flex flex-col gap-5 justify-between">
                    <p className="text-neutral-300 text-sm md:text-[0.9rem] leading-[1.75] font-body tracking-[0.01em]">
                      {getPlainDescription(activeService?.description)}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() =>
                        navigate(`/services/${activeService?.slug || activeService?.id}`)
                      }
                      className="
                        w-full bg-red-600 hover:bg-red-600/90 text-white font-sans text-xs
                        font-bold tracking-[0.15em] uppercase py-3.5 rounded-xl transition-all duration-300
                        shadow-[0_0_12px_rgba(211,47,47,0.25)] hover:shadow-[0_0_20px_rgba(211,47,47,0.4)]
                        flex items-center justify-center gap-2
                      "
                    >
                      <span>Inspect Full Architecture</span>
                      <span className="text-base leading-none">→</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
            {/* end pinned card experience */}
          </div>
        )}

      </div>
    </section>
  );
}
