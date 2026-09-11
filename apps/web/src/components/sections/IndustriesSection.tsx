import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "../ui/SectionTitle";
import { LucideIcon } from "../ui/LucideIcon";
import { MotionCard } from "../ui/MotionCard";
import { getImageUrl, fetchAllPages } from "../../lib/api";
import type { Industry } from "../../types";
import { logger } from '../../lib/logger';

interface IndustriesSectionProps {
  limit?: number;
}

export function IndustriesSection({ limit }: IndustriesSectionProps) {
  const [industriesData, setIndustriesData] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadIndustries = async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = await fetchAllPages("/industries");
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const mappedIndustries: Industry[] = items.map((item: any, index: number) => ({
          id: item.id || item.slug || item._id || `${item.title || "industry"}-${index}`,
          image: getImageUrl(item.image),
          icon: item.icon || "HelpCircle",
          title: item.title || "",
          description: item.description || item.shortDescription || "",
          benefits: Array.isArray(item.segmentBenefits)
            ? item.segmentBenefits
            : Array.isArray(item.benefits)
              ? item.benefits
              : [],
        }));

        if (isMounted) {
          setIndustriesData(mappedIndustries);
        }
      } catch (err) {
        logger.error("Error fetching industries:", err);
        if (isMounted) {
          setError("Unable to load industries.");
          setIndustriesData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadIndustries();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedIndustries = limit ? industriesData.slice(0, limit) : industriesData;

  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-b border-neutral-900">
      {/* Background Red Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionTitle
            subtitle="INDUSTRIES WE SERVE"
            title="Tailored Autonomous AI {for Key Sectors}"
            light
          />
          {limit && (
            <a
              href="/industries"
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 hover:text-white transition-colors border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
            >
              <span>VIEW ALL INDUSTRIES</span>
              <span>→</span>
            </a>
          )}
        </div>

        {loading && (
          <div className="text-center py-20 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading domain frameworks...
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 text-xs font-mono text-red-600">{error}</div>
        )}

        {!loading && !error && displayedIndustries.length === 0 && (
          <div className="text-center py-20 text-xs font-mono text-neutral-500">
            No domain frameworks available at the moment.
          </div>
        )}

        {!loading && !error && displayedIndustries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedIndustries.map((ind, idx) => {
              const isExpanded = expandedId === ind.id;

              return (
                <MotionCard
                  key={ind.id}
                  className="red-glow-card rounded-3xl border border-neutral-850 bg-neutral-950 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                  onClick={() => setExpandedId(isExpanded ? null : ind.id)}
                  id={`ind-card-${ind.id}`}
                >
                  {/* Image Header */}
                  <div className="h-52 relative overflow-hidden">
                    <img
                      src={ind.image}
                      alt={ind.title}
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 p-3 bg-neutral-950 border border-neutral-800 text-red-600 rounded-xl shadow-[0_0_15px_rgba(211,47,47,0.3)]">
                      <LucideIcon name={ind.icon} className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors">
                        {ind.title}
                      </h3>
                      <p className="text-neutral-400 text-xs leading-relaxed font-body mb-4">
                        {ind.description}
                      </p>
                    </div>

                    <div>
                      <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 mt-2">
                        <span>{isExpanded ? "HIDE BENEFITS" : "VIEW SEGMENT BENEFITS"}</span>
                        <span>{isExpanded ? "↑" : "↓"}</span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-neutral-900"
                          >
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-red-600 mb-2 font-bold">
                              Key Outcomes
                            </h4>
                            <ul className="space-y-2">
                              {ind.benefits.map((benefit, bIdx) => (
                                <li key={bIdx} className="text-xs text-neutral-300 flex items-start space-x-2 font-body">
                                  <span className="text-red-600 font-bold">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </MotionCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

