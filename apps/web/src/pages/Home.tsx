import { Hero } from "../components/sections/Hero";
import { MarqueeSection } from "../components/sections/MarqueeSection";
import { WhoWeAre } from "../components/sections/WhoWeAre";
import { ServicesSection } from "../components/sections/ServicesSection";
import { TierBadgeCard } from "../components/ui/TierBadgeCard";
import { WhyChooseUs } from "../components/sections/WhyChooseUs";
import { IndustriesSection } from "../components/sections/IndustriesSection";
import { CaseStudiesSection } from "../components/sections/CaseStudiesSection";
import { Testimonials } from "../components/sections/Testimonials";
import { FAQSection } from "../components/sections/FAQSection";
import { LatestBlogs } from "../components/sections/LatestBlogs";
import { ContactSection } from "../components/sections/ContactSection";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Marquee Text Track (PRESERVED) */}
      <MarqueeSection />

      {/* 3. Who We Are */}
      <WhoWeAre />

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 6. Enterprise Certified Section */}
      <TierBadgeCard />

      {/* 7. Why Choose Us Bento Grid */}
      <WhyChooseUs />

      {/* 8. Industries We Serve */}
      <IndustriesSection limit={6} />

      {/* 9. Case Studies */}
      <CaseStudiesSection limit={4} />

      {/* 10. Testimonials */}
      <Testimonials />

      {/* 11. FAQ Accordion */}
      <FAQSection page="Homepage" />

      {/* 12. Latest Research Publications */}
      <LatestBlogs limit={3} />

      {/* 13. Contact Form Section */}
      <ContactSection />
    </div>
  );
}