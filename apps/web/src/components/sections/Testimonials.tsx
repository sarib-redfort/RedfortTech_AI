import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Testimonial } from "../../types";
import { SectionTitle } from "../ui/SectionTitle";
import { LucideIcon } from "../ui/LucideIcon";
import { getImageUrl, fetchAllPages } from "../../lib/api";
import { logger } from '../../lib/logger';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllPages("/testimonials");
        const testimonialList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const mappedTestimonials = testimonialList.map((item: any) => ({
          id: item.id || item._id || "",
          name: item.name || "",
          role: item.role || "",
          company: item.company || "",
          text: item.message || "",
          rating: Number(item.rating) || 5,
          image: getImageUrl(item.avatar),
        }));

        if (isMounted) {
          setTestimonials(mappedTestimonials);
          setCurrentIndex(0);
        }
      } catch (err) {
        logger.error("Error fetching testimonials:", err);
        if (isMounted) {
          setError("Testimonials are temporarily unavailable.");
          setTestimonials([]);
          setCurrentIndex(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  const showCarousel = !loading && !error && testimonials.length > 0 && current;

  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-b border-neutral-900">
      {/* Red Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="EXECUTIVE TESTIMONIALS"
          title="What Enterprise Leaders {Say About RedFort}"
          centered
          light
        />

        {/* Testimonial Card Frame */}
        <div className="red-glow-card rounded-3xl p-8 md:p-12 border border-neutral-850 bg-neutral-950/90 backdrop-blur-xl relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] mt-12">
          
          {loading && (
            <div className="w-full text-center py-12">
              <div className="text-red-600 flex justify-center mb-6">
                <LucideIcon name="Quote" className="w-12 h-12 opacity-40 animate-pulse" />
              </div>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Fetching client testimonials...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full text-center py-12">
              <p className="text-xs font-mono text-red-600">{error}</p>
            </div>
          )}

          {showCarousel && (
            <AnimatePresence mode="wait">
              <div key={currentIndex} className="w-full text-center" id={`testimonial-${current.id}`}>
                {/* Quote Icon */}
                <div className="text-red-600 flex justify-center mb-6">
                  <LucideIcon name="Quote" className="w-12 h-12 opacity-80 drop-shadow-[0_0_15px_#D32F2F]" />
                </div>

                {/* Quote Body */}
                <blockquote className="text-lg md:text-2xl font-sans font-bold text-white italic leading-relaxed mb-8 max-w-2xl mx-auto">
                  "{current.text}"
                </blockquote>

                {/* Stars */}
                <div className="flex items-center justify-center space-x-1.5 text-red-600 mb-6">
                  {Array.from({ length: current.rating }).map((_, rIdx) => (
                    <LucideIcon key={rIdx} name="Star" className="w-5 h-5 fill-current drop-shadow-[0_0_8px_#D32F2F]" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex flex-col items-center font-sans">
                  {current.image && (
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-16 h-16 rounded-full object-cover grayscale mb-3 border-2 border-red-600 shadow-[0_0_15px_rgba(211,47,47,0.5)]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <cite className="not-italic text-lg font-sans font-black text-white block mb-1">
                    {current.name}
                  </cite>
                  <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
                    {current.role}, {current.company}
                  </span>
                </div>
              </div>
            </AnimatePresence>
          )}

          {/* Navigation Controls */}
          {!loading && !error && testimonials.length > 0 && (
            <div className="flex items-center justify-center space-x-6 mt-10 pt-6 border-t border-neutral-900">
              <button
                onClick={prevTestimonial}
                className="w-11 h-11 rounded-full border border-neutral-800 bg-black text-white hover:border-red-600 hover:text-red-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                aria-label="Previous Testimonial"
              >
                <LucideIcon name="ArrowLeft" className="w-5 h-5" />
              </button>

              <span className="text-xs font-mono text-neutral-400 font-bold">
                {currentIndex + 1} <span className="text-neutral-600">/</span> {testimonials.length}
              </span>

              <button
                onClick={nextTestimonial}
                className="w-11 h-11 rounded-full border border-neutral-800 bg-black text-white hover:border-red-600 hover:text-red-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                aria-label="Next Testimonial"
              >
                <LucideIcon name="ArrowRight" className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

