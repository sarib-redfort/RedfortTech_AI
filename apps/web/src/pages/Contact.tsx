import { PageBanner } from "../components/layout/PageBanner";
import { ContactForm } from "../components/forms/ContactForm";
import { FAQSection } from "../components/sections/FAQSection";
import { MotionTilt } from "../components/ui/MotionTilt";
import { MotionCard } from "../components/ui/MotionCard";
import { companyInfo } from "../data/company";
import { SectionTitle } from "../components/ui/SectionTitle";
import { LucideIcon } from "../components/ui/LucideIcon";

export default function Contact() {
  const contactDetails = [
    {
      title: "HQ Location",
      value: companyInfo.contact.address,
      icon: "MapPin"
    },
    {
      title: "Communications Cell",
      value: `${companyInfo.contact.phone} / ${companyInfo.contact.email}`,
      icon: "Phone"
    },
    {
      title: "Working Hours",
      value: companyInfo.contact.workingHours,
      icon: "Clock"
    }
  ];

  const socialLinks = [
    { name: "Linkedin", url: companyInfo.socials.linkedin, icon: "Linkedin" },
    { name: "Twitter", url: companyInfo.socials.twitter, icon: "Twitter" },
    { name: "Github", url: companyInfo.socials.github, icon: "Github" }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Contact RedFort AI"
        subtitle="Secure encrypted channels for corporate system scoping, resource delegation, and SLA contracts."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Contact" }
        ]}
      />

      {/* Main Contact Grid */}
      <section className="py-28 bg-black border-b border-neutral-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-10">
              <SectionTitle
                subtitle="GET IN TOUCH"
                title="Initiate {Scoping Sprints}"
                light
              />
              <p className="text-neutral-400 text-sm leading-relaxed font-body">
                Connect with our Tx-certified solutions group. Complete the secure requisition form,
                or transmit directly over encrypted secure mail channels.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                {contactDetails.map((det, idx) => (
                  <MotionCard
                    key={idx}
                    className="red-glow-card flex items-start space-x-4 p-5 rounded-2xl border border-neutral-850 bg-neutral-950 group"
                    data-aos="fade-up"
                    data-aos-delay={idx * 80}
                  >
                    <div className="p-3 bg-neutral-900 border border-neutral-800 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all shrink-0 shadow-[0_0_12px_rgba(211,47,47,0.3)]">
                      <LucideIcon name={det.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold mb-1">
                        {det.title}
                      </h4>
                      <p className="text-neutral-300 text-sm font-sans leading-relaxed">
                        {det.value}
                      </p>
                    </div>
                  </MotionCard>
                ))}
              </div>

              {/* Social Channels */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-4">
                  ENCRYPTED CHANNELS
                </span>
                <div className="flex items-center space-x-3">
                  {socialLinks.map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-red-600 text-neutral-400 hover:text-red-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                      aria-label={soc.name}
                    >
                      <LucideIcon name={soc.icon} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <div className="red-glow-card rounded-3xl p-8 border border-neutral-850 bg-neutral-950/80 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection limit={4} page="Contact Page" />
    </div>
  );
}

