import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

export function WhoWeAre() {
  const values = [
    {
      title: "Autonomous Innovation",
      description: "We adopt cutting-edge ML models & multi-agent architectures to engineer future-ready digital systems.",
      icon: "Cpu"
    },
    {
      title: "Zero-Leakage Security",
      description: "Architectures engineered from day one for SOC2, HIPAA, and PCI-DSS compliance.",
      icon: "ShieldCheck"
    },
    {
      title: "Enterprise Excellence",
      description: "Guaranteed 99.99% system SLA and sub-50ms execution speed across all enterprise deployments.",
      icon: "Award"
    }
  ];

  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-b border-neutral-900">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Core Values */}
          <div className="lg:col-span-7">
            <SectionTitle
              subtitle="WHO WE ARE"
              title="We Are {RedFort AI}"
              light
            />
            
            <p className="text-neutral-400 text-base md:text-lg mb-8 leading-relaxed font-body">
              We are a premier software engineering & autonomous AI agency focused on delivering
              high-performance digital platforms. Our mission is to solve complex enterprise hurdles
              with elegant, automated systems that drive compounding corporate value.
            </p>

            {/* Core Values Stack */}
            <div className="space-y-4">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="red-glow-card flex items-start space-x-5 p-5 rounded-2xl border border-neutral-850 bg-neutral-950/80 hover:border-red-600/40 transition-all duration-300 group"
                >
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-[0_0_12px_rgba(211,47,47,0.3)] shrink-0">
                    <LucideIcon name={val.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-sans font-bold text-white group-hover:text-red-600 transition-colors mb-1">
                      {val.title}
                    </h4>
                    <p className="text-neutral-400 text-xs leading-relaxed font-body">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Image Frame with Red Glow */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl pointer-events-none" />
            
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.9)] aspect-square group">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800"
                alt="RedFort AI engineering squad"
                className="w-full h-full object-cover rounded-2xl grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

