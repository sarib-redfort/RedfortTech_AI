import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import { MotionCard } from "./MotionCard";

export function WhyChooseUs() {
  const bentoFeatures = [
    {
      title: "Luxury Enterprise SLA",
      description:
        "Guaranteed 99.99% system availability, sub-50ms model latency, and dedicated engineering cell response times under 15 minutes.",
      icon: "ShieldAlert",
      colSpan: "lg:col-span-7",
      highlight: "SOC2 TYPE II READY",
    },
    {
      title: "Ph.D. Level AI Competency",
      description:
        "Machine learning researchers designing fine-tuned local models, RAG vector pipelines, and autonomous agent chains.",
      icon: "Cpu",
      colSpan: "lg:col-span-5",
      highlight: "FINE-TUNED MODELS",
    },
    {
      title: "Rigid Security Hardening",
      description:
        "Architectures audit-ready for HIPAA, PCI-DSS, and ISO27001 compliance out of the box with zero data leakage guarantees.",
      icon: "Lock",
      colSpan: "lg:col-span-5",
      highlight: "ZERO DATA LEAKAGE",
    },
    {
      title: "Client-First Transparency",
      description:
        "Direct Slack/Teams channel connections with daily production commits, transparent telemetry, and real-time Jira trackers.",
      icon: "RefreshCw",
      colSpan: "lg:col-span-7",
      highlight: "DIRECT ENG CHANNEL",
    },
  ];

  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-y border-neutral-900">
      {/* Red Ambient Background Glow */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="WHY CHOOSE US"
          title="Why Leading Enterprises {Trust RedFort AI}"
          light
        />

        {/* Balanced 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-12">
          {bentoFeatures.map((feat, idx) => (
            <MotionCard
              key={idx}
              className="red-glow-card rounded-3xl p-8 md:p-10 border border-neutral-850 bg-neutral-950 flex flex-col justify-between group cursor-pointer relative overflow-hidden hover:border-red-600/40 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={idx * 90}
              id={`why-choose-card-${idx}`}
            >
              {/* Corner Red Ambient Light Beam */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-600/12 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex flex-col justify-start h-full">
                {/* 1. Icon */}
                <div className="mb-6 self-start p-3.5 bg-neutral-950 border border-neutral-800 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(211,47,47,0.12)]">
                  <LucideIcon name={feat.icon} className="w-6 h-6" />
                </div>

                {/* 2. Heading */}
                <h4 className="text-xl md:text-2xl font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {feat.title}
                </h4>

                {/* 3. Description */}
                <p className="text-neutral-400 text-sm leading-relaxed font-body">
                  {feat.description}
                </p>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

