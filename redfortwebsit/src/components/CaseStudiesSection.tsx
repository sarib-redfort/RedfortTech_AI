import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import { MotionCard } from "./MotionCard";
import { apiUrl, getImageUrl } from "../lib/api";
import type { CaseStudy } from "../types";

interface CaseStudiesSectionProps {
  limit?: number;
  showTitle?: boolean;
}

export function CaseStudiesSection({ limit, showTitle = true }: CaseStudiesSectionProps) {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl("/case-studies"));
        if (!response.ok) {
          throw new Error(`Failed to fetch case studies (${response.status})`);
        }
        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

        const mappedCases = list.map((item: any) => ({
          id: item.slug || item.id || item._id || "",
          image: getImageUrl(item.image),
          title: item.title || "",
          problem: item.shortDescription || "",
          solution: "",
          technologyUsed: [],
          result: "",
          statistics: item.statistics || "PROVEN IMPACT",
          clientFeedback: "",
        }));

        if (isMounted) setCases(mappedCases);
      } catch (err) {
        console.error("Error fetching case studies:", err);
        if (isMounted) {
          setError("Unable to load case studies right now.");
          setCases([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalCasesCount = cases.length;
  const hasMoreThanFour = totalCasesCount > 4;
  const displayedCases = limit ? cases.slice(0, 4) : cases;

  return (
    <section className="bg-black text-white py-28 border-b border-neutral-900 relative overflow-hidden">
      {/* Red Ambient Background Glow */}
      <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <SectionTitle
              subtitle="PROVEN CASE STUDIES"
              title="Transformative {Enterprise Case Studies}"
              light
            />
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading case studies...
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 text-xs font-mono text-red-600">{error}</div>
        )}

        {!loading && !error && displayedCases.length === 0 && (
          <div className="text-center py-20 text-xs font-mono text-neutral-500">
            No case studies available at the moment.
          </div>
        )}

        {/* Case Studies Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && !error && displayedCases.map((cs, idx) => (
            <MotionCard
              key={cs.id}
              className="red-glow-card rounded-3xl border border-neutral-850 bg-neutral-950 overflow-hidden group cursor-pointer flex flex-col justify-between"
              data-aos="fade-up"
              data-aos-delay={idx * 90}
              onClick={() => navigate(`/case-studies/${cs.id}`)}
              id={`cs-card-${cs.id}`}
            >
              {/* Card Image Cover with overlay */}
              <div className="h-64 relative overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Floating Metric Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block text-[10px] font-mono bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-2 shadow-[0_0_12px_#D32F2F]">
                    {cs.statistics}
                  </span>
                  <h3 className="text-2xl font-sans font-black text-white group-hover:text-red-600 transition-colors leading-tight">
                    {cs.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="p-6 bg-neutral-950 flex justify-between items-center border-t border-neutral-900">
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2 max-w-[80%] font-body">
                  {cs.problem}
                </p>
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-[0_0_10px_rgba(211,47,47,0.18)]">
                  <LucideIcon name="ArrowUpRight" className="w-5 h-5 text-white group-hover:text-white transition-colors" />
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* EXPLORE ALL Button (Appears ONLY when total Case Studies > 4 on Home page) */}
        {!loading && !error && limit && hasMoreThanFour && (
          <div className="flex justify-center mt-14">
            <Link
              to="/case-studies"
              className="group relative inline-flex items-center gap-3 bg-black border border-white/20 hover:border-red-600 hover:bg-red-600/10 text-white font-sans text-xs font-bold tracking-[0.18em] uppercase px-9 py-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(211,47,47,0.4)] hover:scale-105"
            >
              <span>EXPLORE ALL</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
