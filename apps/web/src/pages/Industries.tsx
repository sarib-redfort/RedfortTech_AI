import { PageBanner } from "../components/layout/PageBanner";
import { IndustriesSection } from "../components/sections/IndustriesSection";
import { CTA } from "../components/sections/CTA";

export default function IndustriesPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Industries We Service"
        subtitle="Tailored digital solutions, AI operations, and compliance frameworks across 12 unique verticals."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Industries" }
        ]}
      />

      {/* Intro info */}
      <section className="py-24 bg-black border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-red-600 uppercase font-bold">
              SPECIALIZED VERTICAL INTEGRITY
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mb-6">
            Engineered Compliance for <span className="text-red-600 drop-shadow-[0_0_15px_#D32F2F]">Diverse Sectors</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-body">
            Every sector operates under specific system constraints: HIPAA in healthcare, SOC2 in FinTech,
            PCI-DSS in retail checkout lines. At RedFort AI, our developers are fully trained in sector-specific
            regulations, shipping code that is safe, fast, and compliant by default.
          </p>
        </div>
      </section>

      {/* Industries grid (All 12) */}
      <IndustriesSection />

      {/* Call to action */}
      <CTA
        title="Need a Sector-Specific Solutions Architect?"
        description="Connect with our offices in Pakistan or USA. We'll map out a secure compliance blueprint, establish a private code repository, and set up a scoping milestone."
      />
    </div>
  );
}

