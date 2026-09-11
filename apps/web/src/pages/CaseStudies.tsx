import { PageBanner } from "../components/layout/PageBanner";
import { CaseStudiesSection } from "../components/sections/CaseStudiesSection";
import { CTA } from "../components/sections/CTA";
import { FAQSection } from "../components/sections/FAQSection";
import Seo from "../components/Seo";

export default function CaseStudiesPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Seo
        title="Case Studies"
        description="How RedFort AI has delivered measurable outcomes for enterprise clients across finance, healthcare, energy and education."
      />
      {/* Page Banner */}
      <PageBanner
        title="Our Proven Case Studies"
        subtitle="Explore how our certified engineering cell deployed AI-powered systems to yield massive business metrics."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Case Studies" }
        ]}
      />

      {/* Intro Section */}
      <section className="py-24 bg-black border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-red-600 uppercase font-bold">
              QUANTIFIED VERIFIED IMPACT
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mb-6">
            We Build Software That <span className="text-red-600 drop-shadow-[0_0_15px_#D32F2F]">Drives Metrics</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-body">
            A beautiful user interface is only valuable if it performs. Our engineering audits
            always target tangible, quantifiable business outcomes: fuel reductions, conversion uplifts,
            decreased triage bottlenecks, and lower server bills. Explore our detailed cases below.
          </p>
        </div>
      </section>

      {/* Case Studies Grid (All) */}
      <CaseStudiesSection showTitle={false} />

      {/* FAQ Section */}
      <FAQSection page="Case Studies" />

      {/* Radar CTA */}
      <CTA
        title="Ready to Quantify Your Next Engineering Sprint?"
        description="Connect with our solutions department. We'll outline similar industry metrics, draft a high-fidelity Figma storyboard, and commit to strict target metrics."
      />
    </div>
  );
}

