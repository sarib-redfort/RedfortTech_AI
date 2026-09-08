import { Hero } from "../components/Hero";
import { MarqueeSection } from "../components/MarqueeSection";
import { WhoWeAre } from "../components/WhoWeAre";
import { ServicesSection } from "../components/ServicesSection";
import { TierBadgeCard } from "../components/TierBadgeCard";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { IndustriesSection } from "../components/IndustriesSection";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { Testimonials } from "../components/Testimonials";
import { FAQSection } from "../components/FAQSection";
import { LatestBlogs } from "../components/LatestBlogs";
import { ContactSection } from "../components/ContactSection";

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