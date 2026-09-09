import { companyInfo } from "../../data/company";
import { ContactForm } from "../forms/ContactForm";
import { LucideIcon } from "../ui/LucideIcon";

export function ContactSection() {
  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-b border-neutral-900" id="home-contact-section">
      {/* Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-red-600 uppercase font-bold">
                SECURE CONSULTATION SCOPING
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight leading-tight">
              Initiate Your <br />
              <span className="text-red-600 drop-shadow-[0_0_20px_rgba(211,47,47,0.7)]">Enterprise AI</span> Pipeline
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed font-body">
              Our solutions team reviews incoming requirements securely. Connect with us to establish
              a direct Slack channel, map budget parameters, and review code compliance matrices.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-[0_0_12px_rgba(211,47,47,0.3)]">
                  <LucideIcon name="Mail" className="w-4 h-4" />
                </div>
                <span className="text-sm font-mono text-neutral-300 font-medium">{companyInfo.contact.email}</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-[0_0_12px_rgba(211,47,47,0.3)]">
                  <LucideIcon name="Phone" className="w-4 h-4" />
                </div>
                <span className="text-sm font-mono text-neutral-300 font-medium">{companyInfo.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-8 border border-red-600/40 bg-neutral-950/90 backdrop-blur-xl shadow-[0_0_25px_rgba(211,47,47,0.15)]">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

