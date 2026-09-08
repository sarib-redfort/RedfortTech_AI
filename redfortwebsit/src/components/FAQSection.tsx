import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { FAQ } from "../types";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import { apiUrl } from "../lib/api";

interface FAQSectionProps {
  limit?: number;
  page?: string;
  serviceId?: string;
}

export function FAQSection({ limit, page, serviceId }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = serviceId
          ? apiUrl(`/faqs?serviceId=${encodeURIComponent(serviceId)}`)
          : page
            ? apiUrl(`/faqs?page=${encodeURIComponent(page)}`)
            : apiUrl("/faqs");

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs (${response.status})`);
        }
        
        const data = await response.json();
        let faqList: FAQ[] = [];
        if (Array.isArray(data)) {
          faqList = data;
        } else if (Array.isArray(data?.data)) {
          faqList = data.data;
        } else if (data?.success && Array.isArray(data?.data)) {
          faqList = data.data;
        }
        
        const mappedFaqs = faqList.map((item: any) => ({
          id: item.id || item._id,
          question: item.question,
          answer: item.answer,
        }));
        
        setFaqs(mappedFaqs);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load frequently asked questions. Please try again later.");
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [page, serviceId]);

  useEffect(() => {
    setIsExpanded(false);
    setOpenId(null);
  }, [page, serviceId]);

  const shouldCollapseHomepage = page === "Homepage" && !limit;
  const displayedFaqs = shouldCollapseHomepage
    ? (isExpanded ? faqs : faqs.slice(0, 10))
    : limit
      ? faqs.slice(0, limit)
      : faqs;
  const hasMoreFaqs = shouldCollapseHomepage && faqs.length > 10;

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-black text-white py-28 border-b border-neutral-900 relative overflow-hidden">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="FREQUENTLY ASKED QUESTIONS"
          title="Answers to Your {Technical Questions}"
          centered
          light
        />

        <div className="space-y-4 mt-12">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-8 h-8 border-4 border-neutral-800 border-t-red-600 rounded-full animate-spin" />
              <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest">
                Fetching FAQ knowledge base...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-neutral-950 border border-red-600/40 rounded-2xl p-6 text-center">
              <LucideIcon name="AlertCircle" className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-red-600 text-xs font-mono">{error}</p>
            </div>
          )}

          {!loading && !error && displayedFaqs.length === 0 && (
            <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-12 text-center">
              <LucideIcon name="HelpCircle" className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 text-xs font-mono">
                No frequently asked questions available at this time.
              </p>
            </div>
          )}

          {!loading && displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`red-glow-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-red-600 bg-neutral-950 shadow-[0_0_15px_rgba(211,47,47,0.15)]" : "border-neutral-850 bg-neutral-950/80"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center space-x-4 cursor-pointer focus:outline-none select-none group"
                >
                  <span className="text-base md:text-lg font-sans font-bold text-white group-hover:text-red-600 transition-colors">
                    {faq.question}
                  </span>
                  
                  {/* Rotating + / - icon that transforms to x when open */}
                  <div className={`p-2 rounded-full border transition-all duration-300 shrink-0 ${
                    isOpen
                      ? "bg-red-600 border-red-600 text-white rotate-45 shadow-[0_0_10px_#D32F2F]"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 group-hover:border-red-600 group-hover:text-red-600"
                  }`}>
                    <LucideIcon name="Plus" className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-neutral-300 leading-relaxed font-body border-t border-neutral-900 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {!loading && !error && hasMoreFaqs && (
            <div className="text-center pt-8">
              <Link
                to="/faq"
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-600/90 px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(211,47,47,0.35)] hover:scale-105"
              >
                <span>RED MORE</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

