import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<"enterprise" | "agents" | "custom">("enterprise");

  const tabs = [
    { id: "enterprise", label: "ENTERPRISE AI" },
    { id: "agents", label: "AUTONOMOUS AGENTS" },
    { id: "custom", label: "CUSTOM STACK" },
  ];

  const packages = [
    {
      name: "Starter AI",
      tagline: "Essential machine learning models & API integration",
      price: "$2,499",
      period: "/ month",
      featured: false,
      features: [
        "Core LLM & API Integrations",
        "Sub-100ms Response Times",
        "99.9% Uptime Guarantee",
        "Standard Email Support",
      ],
      buttonText: "START NOW",
    },
    {
      name: "Professional",
      tagline: "Custom model fine-tuning & workflow automation",
      price: "$4,999",
      period: "/ month",
      featured: false,
      features: [
        "Domain Fine-Tuned Models",
        "RAG Vector Database Pipeline",
        "Custom UI / Frontend Dashboards",
        "Priority Slack Channel Support",
      ],
      buttonText: "DEPLOY PRO",
    },
    {
      name: "Enterprise Flagship",
      tagline: "Full-stack autonomous multi-agent swarm architecture",
      price: "$9,999",
      period: "/ month",
      featured: true, // HIGHLIGHTED TIER WITH GLOWING RED BORDER
      features: [
        "Autonomous Agent Orchestration",
        "SOC2 & HIPAA Audit Ready",
        "Dedicated Engineering Squad",
        "24/7 Real-Time Telemetry & SLA",
        "Zero-Downtime Migration Layer",
      ],
      buttonText: "GET STARTED",
    },
    {
      name: "Custom Matrix",
      tagline: "Bespoke high-frequency AI & cloud infrastructure",
      price: "Custom",
      period: "",
      featured: false,
      features: [
        "On-Premise Private Cluster",
        "Air-Gapped Local Hardware",
        "Unlimited Agent Execution",
        "Exec SLA & On-Call Team",
      ],
      buttonText: "CONTACT SALES",
    },
  ];

  return (
    <section className="bg-black text-white py-28 border-b border-neutral-900 relative overflow-hidden">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="TRANSPARENT TIER ARCHITECTURE"
          title="Designed for Scalable {Enterprise Growth}"
          centered
          light
        />

        {/* Pill-Shaped Tab Switcher */}
        <div className="flex justify-center my-10">
          <div className="inline-flex items-center bg-neutral-950 p-1.5 rounded-full border border-neutral-850 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs font-mono font-bold tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-red-600 text-white shadow-[0_0_20px_rgba(211,47,47,0.6)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Vertical Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg, idx) => {
            const isFeatured = pkg.featured;
            return (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 70}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 relative group cursor-pointer ${
                  isFeatured
                    ? "red-highlight-card scale-[1.03] z-20 border-red-600 shadow-[0_0_40px_rgba(211,47,47,0.35)]"
                    : "bg-neutral-950/80 border border-neutral-850 hover:border-red-600/40 hover:shadow-[0_0_25px_rgba(211,47,47,0.2)]"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-full shadow-[0_0_12px_#D32F2F]">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h4 className="text-xl font-sans font-bold text-white mb-2">
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-body min-h-[36px] mb-6">
                    {pkg.tagline}
                  </p>

                  <div className="mb-6 pb-6 border-b border-neutral-800 flex items-baseline gap-1">
                    <span className="text-4xl font-sans font-black text-white">
                      {pkg.price}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {pkg.period}
                    </span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5 text-xs text-neutral-300 font-body">
                        <LucideIcon name="CheckCircle2" className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-3.5 rounded-full text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isFeatured
                      ? "bg-red-600 hover:bg-red-600/90 text-white shadow-[0_0_20px_rgba(211,47,47,0.5)]"
                      : "bg-neutral-900 hover:bg-red-600/10 text-white border border-neutral-800 hover:border-red-600"
                  }`}
                >
                  <span>{pkg.buttonText}</span>
                  <span>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
