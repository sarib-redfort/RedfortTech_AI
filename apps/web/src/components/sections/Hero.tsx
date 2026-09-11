import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LucideIcon } from "../ui/LucideIcon";
import { apiUrl, getImageUrl } from "../../lib/api";
import { useHeroAnimations } from "../../hooks/useHeroAnimations";
import { useMotionTilt } from "../../hooks/useMotionTilt";
import { usePreloaderDone } from "../../App";
import { logger } from '../../lib/logger';

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800";

const fallbackHeroContent = {
  title: "Building Digital Solutions That Empower Businesses",
  description:
    "RedFort AI delivers innovative, scalable, and highly secure AI integrations and full-stack software architectures designed to amplify enterprise productivity.",
  buttonText: "EXPLORE SERVICES",
  image: FALLBACK_IMAGE,
};

function resolveHeroImage(image?: string) {
  if (!image) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(image)) {
    return image;
  }
  return getImageUrl(image);
}

function normalizeHeroPayload(payload: any) {
  const data = payload?.data ?? payload;
  return {
    title: data?.heroTitle || fallbackHeroContent.title,
    description: data?.heroDescription || fallbackHeroContent.description,
    buttonText: data?.buttonText || fallbackHeroContent.buttonText,
    image: resolveHeroImage(data?.heroImage),
  };
}

export function Hero() {
  const preloaderDone = usePreloaderDone();

  const trustBadges = [
    { label: "Autonomous AI", icon: "Cpu" },
    { label: "Enterprise SLA", icon: "ShieldCheck" },
    { label: "SOC2 Compliance", icon: "Lock" },
    { label: "24/7 Monitoring", icon: "Zap" },
  ];

  const [heroContent, setHeroContent] = useState(fallbackHeroContent);
  const [loading, setLoading] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef  = useRef<HTMLElement>(null!);
  const textGroupRef  = useRef<HTMLDivElement>(null!);
  const heroVisualRef = useRef<HTMLDivElement>(null!);
  const imageGlowRef  = useRef<HTMLDivElement>(null!);
  const cursorGlowRef = useRef<HTMLDivElement>(null!);

  // 3D Motion Tilt for the Right Visual Logo
  const tilt = useMotionTilt(1.04, 8);

  // ── Reduced motion check ──────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Hero Entrance Animation Sequence Hook ────────────────────────────────
  useHeroAnimations(
    containerRef,
    textGroupRef,
    heroVisualRef,
    imageGlowRef,
    isReducedMotion,
    preloaderDone
  );

  // ── Smooth Lerped Cursor Gradient ─────────────────────────────────────────
  useEffect(() => {
    if (isReducedMotion) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const container = containerRef.current;
    const glow = cursorGlowRef.current;
    if (!container || !glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const animateGlow = () => {
      // Lerp smoothing factor (0.06 for delayed cinematic inertia)
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (glow) {
        glow.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }
      rafId = requestAnimationFrame(animateGlow);
    };

    container.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animateGlow);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion]);

  // ── CMS Data Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const loadHeroContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl("/homepage"));
        if (!response.ok) {
          throw new Error(`Failed to fetch hero content (${response.status})`);
        }
        const payload = await response.json();
        if (!isMounted) return;
        setHeroContent(normalizeHeroPayload(payload));
      } catch (error) {
        logger.error("Hero: failed to load homepage data", error);
        if (isMounted) {
          setHeroContent(fallbackHeroContent);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadHeroContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroTitle = heroContent.title;
  const heroDescription = heroContent.description;
  const primaryButtonText = heroContent.buttonText;

  // Highlight middle phrase/word in brand red #D32F2F
  const renderStyledTitle = () => {
    const words = heroTitle.split(" ");
    if (words.length < 3) return heroTitle;
    const midIndex = Math.floor(words.length / 2);
    return (
      <>
        {words.slice(0, midIndex).join(" ")}{" "}
        <span className="text-red-600 drop-shadow-[0_0_8px_rgba(211,47,47,0.18)]">
          {words[midIndex]}
        </span>{" "}
        {words.slice(midIndex + 1).join(" ")}
      </>
    );
  };

  return (
    <header
      ref={containerRef}
      className="relative bg-black text-white min-h-[92vh] flex items-center pt-32 pb-24 overflow-hidden border-b border-neutral-900 selection:bg-red-600 selection:text-white"
    >
      {/* Soft Ambient Vertical Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] top-light-beam pointer-events-none z-0" />

      {/* Deep Ambient Red Radial Spotlight on Right Side */}
      <div className="absolute top-1/4 right-5 w-[600px] h-[600px] bg-red-600/10 blur-[170px] rounded-full pointer-events-none z-0" />

      {/* Lerped Cursor-Following Radial Glow */}
      <div
        ref={cursorGlowRef}
        className="absolute pointer-events-none z-0 w-[500px] h-[500px] rounded-full bg-red-600/8 blur-[120px] transition-none"
        style={{ willChange: "transform", top: 0, left: 0 }}
      />

      {/* Fine Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none z-0" />

      {/* ── Main Container (Two-Column Layout: Left Text 54%, Right Visual 46%) ── */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">

          {/* ── LEFT COLUMN: CMS Text, CTAs & Restored Feature Tags ── */}
          <div
            ref={textGroupRef}
            className="w-full lg:w-[54%] space-y-8 text-left"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Main Headline */}
            <h1 className="hero-cin-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-[1.08] text-white" style={{ opacity: 0 }}>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-14 w-full bg-neutral-900 rounded-xl animate-pulse" />
                  <div className="h-14 w-3/4 bg-neutral-900 rounded-xl animate-pulse" />
                </div>
              ) : (
                <span className="block">{renderStyledTitle()}</span>
              )}
            </h1>

            {/* Description */}
            {/* The loading skeleton is a <span>, not a <div>: a <p> may only
                contain phrasing content, so a block child makes the browser
                close the paragraph early and breaks the layout. */}
            <p className="hero-cin-desc text-neutral-300 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-body" style={{ opacity: 0 }}>
              {loading ? (
                <span className="block h-16 w-full bg-neutral-900 rounded-lg animate-pulse" />
              ) : (
                heroDescription
              )}
            </p>

            {/* Side-by-side CTA Buttons */}
            <div className="hero-cin-cta flex flex-wrap items-center gap-4 pt-2" style={{ opacity: 0 }}>
              <Link
                to="/services"
                className="group relative inline-flex items-center gap-3 bg-red-600 hover:bg-red-600/95 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(211,47,47,0.4)] hover:shadow-[0_0_30px_rgba(211,47,47,0.6)] hover:scale-105"
              >
                <span>{primaryButtonText}</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>

              <Link
                to="/about"
                className="group relative inline-flex items-center gap-3 bg-black border border-white/20 hover:border-white/50 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/5 hover:scale-105"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>

            {/* Restored Hero Feature Row (Autonomous AI, Enterprise SLA, SOC2 Compliance, 24/7 Monitoring) - NO WHITE/GRAY BORDERS */}
            <div className="hero-cin-features grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-900" style={{ opacity: 0 }}>
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 bg-neutral-950/90 border border-red-600/15 rounded-xl backdrop-blur-sm shadow-none ring-0 outline-none">
                  <div className="p-1.5 bg-neutral-900/60 border border-red-600/20 rounded-lg text-red-600 shrink-0">
                    <LucideIcon name={badge.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] md:text-xs text-neutral-300 font-mono uppercase tracking-wider font-semibold">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT COLUMN: CMS Hero Image in Premium Red-Bordered Frame ── */}
          <div
            ref={heroVisualRef}
            className="w-full lg:w-[46%] flex items-start justify-center lg:justify-end relative -translate-y-[20px] lg:translate-y-[20px] lg:-translate-x-[60px]"
            style={{ willChange: "transform, opacity", opacity: 0 }}
          >
            {/* Extremely subtle ambient red glow behind the image frame */}
            <div
              ref={imageGlowRef}
              className="absolute w-[460px] h-[460px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none z-0"
            />

            <motion.div
              className="relative z-10 flex items-center justify-center"
              animate={!isReducedMotion ? { y: isHovered ? 0 : [0, -8, 0] } : {}}
              transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
              style={tilt.style}
              onMouseMove={(e) => {
                setIsHovered(true);
                tilt.onMouseMove(e);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
                tilt.onMouseLeave();
              }}
            >
              {/* Premium Red-Bordered CMS Hero Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-red-600/40 shadow-[0_0_0_1px_rgba(211,47,47,0.15),0_8px_40px_rgba(0,0,0,0.85)] translate-y-[20px]">
                {/* Thin inner red accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent z-10 pointer-events-none" />
                {/* Thin inner red accent line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent z-10 pointer-events-none" />

                {loading ? (
                  <div className="w-[280px] h-[210px] sm:w-[360px] sm:h-[270px] md:w-[430px] md:h-[320px] lg:w-[490px] lg:h-[370px] bg-neutral-900 animate-pulse" />
                ) : (
                  <img
                    src={heroContent.image}
                    alt="RedFort AI — Enterprise Intelligence Platform"
                    className="w-[280px] h-[210px] sm:w-[360px] sm:h-[270px] md:w-[430px] md:h-[320px] lg:w-[490px] lg:h-[370px] object-cover block"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </header>
  );
}