import { PageBanner } from "../components/layout/PageBanner";
import { ServicesSection } from "../components/sections/ServicesSection";
import { CTA } from "../components/sections/CTA";
import { SectionTitle } from "../components/ui/SectionTitle";
import { MotionCard } from "../components/ui/MotionCard";

export default function ServicesPage() {
  const processSteps = [
    {
      num: "01",
      title: "Scoping & Discovery",
      desc: "A senior architect maps your existing schema constraints, budget models, and timelines in a dedicated discovery session."
    },
    {
      num: "02",
      title: "Agile Sprints",
      desc: "We write clean, typed code in weekly iterations. You have real-time access to a private staging URL and progress metrics."
    },
    {
      num: "03",
      title: "QA & Vulnerability Scans",
      desc: "Continuous browser tests (via Playwright) and automated security audits check for code integrity prior to any launch."
    },
    {
      num: "04",
      title: "Production SLA",
      desc: "Deploying code with zero-downtime rolling clusters, managed under a robust SLA that keeps metrics optimal."
    }
  ];

  const techStackCategories = [
    {
      title: "Artificial Intelligence",
      items: ["TensorFlow", "PyTorch", "Gemini API", "Hugging Face", "Pinecone Vector DB", "LangChain"]
    },
    {
      title: "Frontend Engineering",
      items: ["React 19", "TypeScript", "Next.js 15", "Vite", "Tailwind CSS", "Framer Motion"]
    },
    {
      title: "Backend & Systems",
      items: ["Node.js (NestJS)", "Express", "Python (FastAPI)", "PostgreSQL", "MongoDB", "Redis"]
    },
    {
      title: "Cloud & Orchestration",
      items: ["AWS Cloud Run", "Google Cloud Platform", "Docker", "Kubernetes", "Terraform", "GitHub Actions"]
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Our Technical Services"
        subtitle="Full Stack Development, Artificial Intelligence & Machine Learning, Business Automation, and AI Full Stack Solutions."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Services" }
        ]}
      />

      {/* Introduction */}
      <section className="py-24 bg-black border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-red-600 uppercase font-bold">
              ENTERPRISE-GRADE CAPABILITIES
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mb-6">
            We Deliver Premium IT & AI Infrastructure
          </h2>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-body">
            Whether you need a custom LLM fine-tuned on company files, a highly scalable SaaS platform,
            or an automated robotic process (RPA) pipeline, RedFort AI provides certified engineering cells
            focused entirely on rapid velocity and immaculate code execution.
          </p>
        </div>
      </section>

      {/* Redesigned Services Cards Grid (Case Study Card Visual Style) */}
      <ServicesSection showTitle={false} useCaseStudyStyle={true} />

      {/* Technology Stack */}
      <section className="py-28 bg-black text-white relative overflow-hidden border-b border-neutral-900">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionTitle
            subtitle="OUR FRAMEWORKS"
            title="Our Advanced {Technology Stack}"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {techStackCategories.map((cat, idx) => (
              <MotionCard
                key={idx}
                className="red-glow-card rounded-3xl p-8 border border-neutral-850 bg-neutral-950"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <h4 className="text-xs font-mono uppercase tracking-widest text-red-600 mb-6 font-bold">
                  {cat.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="bg-black text-neutral-300 border border-neutral-800 px-3 py-1.5 text-xs rounded-xl font-mono hover:border-red-600 hover:text-white transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* Four-Stage Development Process */}
      <section className="py-28 bg-black border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="METHODOLOGY"
            title="Our Four-Stage {Development Process}"
            centered
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {processSteps.map((step, idx) => (
              <MotionCard
                key={idx}
                className="red-glow-card rounded-3xl p-8 border border-neutral-850 bg-neutral-950 flex flex-col justify-between group"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <div>
                  <span className="block text-5xl font-sans font-black text-neutral-800 group-hover:text-red-600 transition-colors mb-6">
                    {step.num}
                  </span>
                  <h4 className="text-xl font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-neutral-400 text-xs leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* Radar CTA */}
      <CTA />
    </div>
  );
}
