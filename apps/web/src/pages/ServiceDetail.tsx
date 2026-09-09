import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FAQSection } from "../components/sections/FAQSection";
import { CTA } from "../components/sections/CTA";
import { LucideIcon } from "../components/ui/LucideIcon";
import { apiUrl } from "../lib/api";
import type { Service } from "../types";
import { logger } from '../lib/logger';

function normalizeService(item: any): Service {
  return {
    id: item?.id || item?._id || item?.slug || item?.title || "",
    title: item?.title || "",
    description: item?.description || item?.longDescription || item?.shortDescription || "",
    icon: item?.icon || "Cpu",
    status: item?.status,
    slug: item?.slug || "",
  };
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setService(null);
      setError("Service details are unavailable.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl(`/services/${encodeURIComponent(id)}`));
        if (!response.ok) {
          throw new Error(`Failed to fetch service details (${response.status})`);
        }
        const payload = await response.json();
        const detail = normalizeService(payload?.data || payload);
        if (isMounted) setService(detail);
      } catch (err) {
        logger.error("Error fetching service details:", err);
        if (isMounted) {
          setService(null);
          setError("Unable to load the full service details right now.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchService();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 border-b border-neutral-900 relative overflow-hidden">
      {/* Top Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] top-light-beam-subtle pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="pb-10 border-b border-neutral-900">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-red-600 text-white rounded-2xl shadow-[0_0_20px_rgba(211,47,47,0.6)]">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LucideIcon name={service?.icon || "Cpu"} className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 block font-bold">
                ENTERPRISE SERVICE SPECIFICATION
              </span>
              <h1 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-1">
                {loading ? "Loading service details..." : service?.title || "Service Architecture"}
              </h1>
            </div>
          </div>
        </div>

        <div className="pt-10">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-8 h-8 border-4 border-neutral-800 border-t-red-600 rounded-full animate-spin" />
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Retrieving architecture payload...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-neutral-950 border border-red-600/40 rounded-2xl p-6 text-center text-red-600 font-mono text-xs">
              {error}
            </div>
          )}

          {!loading && !error && service?.description && (
            <div
              className="prose prose-invert prose-base max-w-none prose-headings:font-sans prose-p:text-neutral-300 prose-p:leading-relaxed prose-a:text-red-600 prose-li:text-neutral-300 prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          )}

          {!loading && !error && !service?.description && (
            <p className="text-neutral-400 font-mono text-sm text-center py-12">
              No service description details are available for this module.
            </p>
          )}
        </div>

        <div className="mt-16">
          <FAQSection serviceId={id} />
        </div>
      </div>

      <div className="mt-20">
        <CTA />
      </div>
    </div>
  );
}

