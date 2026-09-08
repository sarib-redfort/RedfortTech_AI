import { useEffect, useState } from "react";
import { companyInfo } from "../data/company";
import { PageBanner } from "../components/PageBanner";
import { StatsSection } from "../components/StatsSection";
import { GrowthTimeline } from "../components/GrowthTimeline";
import { TierBadgeCard } from "../components/TierBadgeCard";
import { CTA } from "../components/CTA";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";
import { FAQSection } from "../components/FAQSection";
import { MotionTilt } from "../components/MotionTilt";
import { MotionCard } from "../components/MotionCard";
import { apiUrl, getImageUrl } from "../lib/api";
import type { TeamMember } from "../types";

const fallbackAboutContent = {
  title: "About Our Enterprise",
  description: companyInfo.detailedDescription,
  image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800",
};

const fallbackStats = [
  { id: "stat-1", value: "50+", label: "Projects Completed" },
  { id: "stat-2", value: "30+", label: "Happy Clients" },
  { id: "stat-3", value: "12+", label: "Industries Served" },
  { id: "stat-4", value: "5+", label: "Years Experience" },
];

function resolveImageUrl(image?: string) {
  if (!image) return fallbackAboutContent.image;
  if (/^https?:\/\//i.test(image)) return image;
  return getImageUrl(image);
}

function formatStatValue(value: unknown, suffix: string) {
  if (value === null || value === undefined || value === "") return suffix;
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return `${numericValue}${suffix}`;
  }
  return `${String(value)}${suffix}`;
}

export default function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState(fallbackAboutContent);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    let isMounted = true;

    const loadAboutContent = async () => {
      try {
        setAboutLoading(true);
        const response = await fetch(apiUrl("/about"));
        if (!response.ok) {
          throw new Error(`Failed to fetch about content (${response.status})`);
        }
        const payload = await response.json();
        const data = payload?.data ?? payload;
        if (!isMounted) return;
        setAboutContent({
          title: data?.title || fallbackAboutContent.title,
          description: data?.description || fallbackAboutContent.description,
          image: resolveImageUrl(data?.image),
        });
      } catch (err) {
        console.error("Error fetching about content:", err);
        if (isMounted) {
          setAboutContent(fallbackAboutContent);
        }
      } finally {
        if (isMounted) {
          setAboutLoading(false);
        }
      }
    };

    const loadHomepageStats = async () => {
      try {
        const response = await fetch(apiUrl("/homepage"));
        if (!response.ok) {
          throw new Error(`Failed to fetch homepage stats (${response.status})`);
        }
        const payload = await response.json();
        const data = payload?.data ?? payload;
        if (!isMounted) return;
        setStats([
          { id: "stat-1", value: "50+", label: "Projects Completed" },
          { id: "stat-2", value: formatStatValue(data?.happyClients, "+"), label: "Happy Clients" },
          { id: "stat-3", value: formatStatValue(data?.industriesServed, "+"), label: "Industries Served" },
          { id: "stat-4", value: formatStatValue(data?.yearsExperience, "+"), label: "Years Experience" },
        ]);
      } catch (err) {
        console.error("Error fetching homepage stats:", err);
        if (isMounted) setStats(fallbackStats);
      }
    };

    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl("/team"));
        if (!response.ok) {
          throw new Error(`Failed to fetch team members (${response.status})`);
        }
        const payload = await response.json();
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const mappedMembers: TeamMember[] = items
          .filter((item: any) => item?.status === "Active")
          .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((item: any, index: number) => ({
            id: item.id || item._id || item.slug || `${item.name || "team"}-${index}`,
            name: item.name || "",
            role: item.role || "",
            image: resolveImageUrl(item.image),
            bio: item.description || "",
            social: {
              linkedin: item.linkedinUrl || undefined,
              twitter: item.twitterUrl || undefined
            }
          }));

        if (isMounted) setTeamMembers(mappedMembers);
      } catch (err) {
        console.error("Error fetching team members:", err);
        if (isMounted) {
          setError("Unable to load team members.");
          setTeamMembers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAboutContent();
    loadHomepageStats();
    loadTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const galleryImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600",
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600"
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title={aboutLoading ? "Loading..." : aboutContent.title}
        subtitle={aboutLoading ? "Loading..." : aboutContent.description}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "About" }
        ]}
      />

      {/* Story Section */}
      <section className="py-28 bg-black border-b border-neutral-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl pointer-events-none" />
              <MotionTilt className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-neutral-800 bg-neutral-950 aspect-video group">
                <img
                  src={aboutContent.image}
                  alt={aboutContent.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </MotionTilt>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <SectionTitle
                subtitle="OUR STORY"
                title="Smarter Operations {Built on Trust & SLA}"
                light
              />
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-body">
                {companyInfo.detailedDescription}
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed font-body">
                At RedFort AI, we operate with a strict philosophy of zero-leak data security.
                We specialize in deploying local models that keep financial and healthcare data private,
                protecting your core enterprise asset: proprietary operational intelligence.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3D Tier Badge Card */}
      <TierBadgeCard />

      {/* Storytelling & Growth Timeline */}
      <GrowthTimeline />

      {/* Mission & Vision Bento */}
      <section className="py-28 bg-black border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="red-glow-card rounded-3xl p-8 border border-neutral-850 bg-neutral-950 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 text-red-600 rounded-2xl inline-block mb-6 group-hover:bg-red-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(211,47,47,0.3)]">
                  <LucideIcon name="Target" className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-sans font-extrabold text-white mb-4 group-hover:text-red-600 transition-colors">
                  Our Enterprise Mission
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-body">
                  To engineer highly performant, luxury-grade software interfaces and autonomous AI pipelines
                  that eliminate routine back-office friction, allowing human teams to focus on high-impact strategic growth.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 mt-8 block">MISSION STATUTORY DEFIANCE</span>
            </div>

            {/* Vision */}
            <div className="red-glow-card rounded-3xl p-8 border border-neutral-850 bg-neutral-950 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 text-red-600 rounded-2xl inline-block mb-6 group-hover:bg-red-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(211,47,47,0.3)]">
                  <LucideIcon name="Compass" className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-sans font-extrabold text-white mb-4 group-hover:text-red-600 transition-colors">
                  Our Corporate Vision
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-body">
                  To stand as the global benchmark of reliable enterprise AI, bridging the divide between static cloud databases
                  and dynamic multi-modal generative agents with extreme structural integrity and comfortable UX.
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 mt-8 block">VISIONARY HORIZONS VECTOR</span>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Leadership Cell */}
      <section className="py-28 bg-black border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="LEADERSHIP CELL"
            title="Meet Our {Executive Squad}"
            centered
            light
          />

          {loading && (
            <div className="text-center py-20 text-xs font-mono text-neutral-400 uppercase tracking-widest">
              Loading executive squad...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20 text-xs font-mono text-red-600">{error}</div>
          )}

          {!loading && !error && teamMembers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {teamMembers.map((member, idx) => (
                <MotionCard
                  key={member.id}
                  className="red-glow-card rounded-3xl overflow-hidden border border-neutral-850 bg-neutral-950 flex flex-col justify-between group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                  id={`team-member-${member.id}`}
                >
                  <div className="aspect-square overflow-hidden bg-black relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-sans font-extrabold text-white group-hover:text-red-600 transition-colors">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 block mb-3 font-bold">
                        {member.role}
                      </span>
                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 font-body">
                        {member.bio}
                      </p>
                    </div>

                    {(member.social?.linkedin || member.social?.twitter) && (
                      <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-neutral-900">
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-red-600 transition-colors"
                          >
                            <LucideIcon name="Linkedin" className="w-4 h-4" />
                          </a>
                        )}
                        {member.social?.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-red-600 transition-colors"
                          >
                            <LucideIcon name="Twitter" className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </MotionCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-28 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="WORKSPACE & LABS"
            title="Our {Engineering Labs}"
            centered
            light
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {galleryImages.map((imgUrl, gIdx) => (
              <MotionCard
                key={gIdx}
                className="aspect-square rounded-3xl overflow-hidden border border-neutral-850 bg-neutral-950 relative group red-glow-card"
                data-aos="fade-up"
                data-aos-delay={gIdx * 80}
              >
                <img
                  src={imgUrl}
                  alt={`RedFort office layout ${gIdx + 1}`}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection page="About Page" />

      {/* Radar CTA */}
      <CTA />
    </div>
  );
}

