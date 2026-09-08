/**
 * Content seed.
 *
 * Populates the CMS with the marketing content that ships with the website
 * (redfortwebsit/src/data/*), exported to prisma/seed-data.json.
 *
 * Idempotent: every record is matched on a natural key (slug / title / name)
 * and updated in place, so re-running will not create duplicates.
 *
 * Run with:  npm run prisma:seed:content
 */
import { PrismaClient, Status } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { generateSlug } from '../src/common/utils/slug.util';

const prisma = new PrismaClient();

type Seed = {
  services: any[];
  testimonials: any[];
  teamMembers: any[];
  faqs: any[];
  industries: any[];
  caseStudies: any[];
  blogs: any[];
  companyInfo: any;
  statistics: { value: string; label: string }[];
};

const data: Seed = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf-8'),
);

/** "50+" -> 50, "98%" -> 98 */
const toInt = (v?: string) =>
  parseInt(String(v ?? '').replace(/\D/g, ''), 10) || 0;

const statOf = (label: string) =>
  toInt(data.statistics.find((s) => s.label === label)?.value);

async function seedServices() {
  for (const s of data.services) {
    const existing = await prisma.service.findFirst({
      where: { title: s.title },
    });
    const payload = {
      title: s.title,
      description: s.longDescription || s.shortDescription,
      icon: s.icon ?? null,
      status: Status.Active,
    };
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.service.create({ data: payload });
    }
  }
  return data.services.length;
}

async function seedIndustries() {
  for (const i of data.industries) {
    const slug = generateSlug(i.title);
    const payload = {
      title: i.title,
      image: i.image ?? null,
      description: i.description,
      segmentBenefits: i.benefits ?? [],
      icon: i.icon ?? null,
      status: Status.Active,
    };
    await prisma.industry.upsert({
      where: { slug },
      update: payload,
      create: { ...payload, slug },
    });
  }
  return data.industries.length;
}

async function seedCaseStudies() {
  for (const c of data.caseStudies) {
    const slug = generateSlug(c.title);
    // The website model splits a case study into problem/solution/result;
    // the CMS stores one rich-text body plus a short summary.
    const content = [
      '<h2>Problem</h2><p>' + c.problem + '</p>',
      '<h2>Solution</h2><p>' + c.solution + '</p>',
      '<h2>Result</h2><p>' + c.result + '</p>',
      c.clientFeedback ? '<blockquote>' + c.clientFeedback + '</blockquote>' : '',
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      title: c.title,
      image: c.image ?? null,
      shortDescription: c.statistics || c.result,
      content,
      technologies: c.technologyUsed ?? [],
      status: Status.Active,
    };
    await prisma.caseStudy.upsert({
      where: { slug },
      update: payload,
      create: { ...payload, slug },
    });
  }
  return data.caseStudies.length;
}

async function seedBlogs() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@redforai.com' },
  });

  for (const b of data.blogs) {
    const slug = b.slug || generateSlug(b.title);
    const publishedAt = new Date(b.date);
    const payload = {
      title: b.title,
      category: b.category,
      image: b.image ?? null,
      content: b.content,
      createdBy: admin?.id ?? null,
      authorName: b.author ?? null,
      metaTitle: b.title,
      metaDescription: b.excerpt ?? null,
      status: Status.Active,
      publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    };
    await prisma.blog.upsert({
      where: { slug },
      update: payload,
      create: { ...payload, slug },
    });
  }
  return data.blogs.length;
}

async function seedTestimonials() {
  for (const t of data.testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name, company: t.company ?? null },
    });
    const payload = {
      name: t.name,
      role: t.role ?? null,
      company: t.company ?? null,
      avatar: t.image ?? null,
      rating: t.rating ?? 5,
      message: t.text,
    };
    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      await prisma.testimonial.create({ data: payload });
    }
  }
  return data.testimonials.length;
}

async function seedTeam() {
  let order = 0;
  for (const m of data.teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: m.name },
    });
    const payload = {
      image: m.image ?? null,
      name: m.name,
      role: m.role,
      description: m.bio,
      linkedinUrl: m.social?.linkedin ?? null,
      twitterUrl: m.social?.twitter ?? null,
      status: Status.Active,
      displayOrder: order++,
    };
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      await prisma.teamMember.create({ data: payload });
    }
  }
  return data.teamMembers.length;
}

async function seedFaqs() {
  for (const f of data.faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: f.question },
    });
    const payload = {
      question: f.question,
      answer: f.answer,
      page: 'home',
      status: Status.Active,
    };
    if (existing) {
      await prisma.fAQ.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.fAQ.create({ data: payload });
    }
  }
  return data.faqs.length;
}

async function seedSingletons() {
  const c = data.companyInfo;

  const homepagePayload = {
    heroTitle: c.name,
    heroDescription: c.description,
    heroImage: null,
    buttonText: 'Book a Consultation',
    happyClients: statOf('Happy Clients'),
    industriesServed: statOf('Industries Served'),
    yearsExperience: statOf('Years Experience'),
    clientSatisfaction: statOf('Client Satisfaction'),
  };
  const homepage = await prisma.homepage.findFirst();
  if (homepage) {
    await prisma.homepage.update({
      where: { id: homepage.id },
      data: homepagePayload,
    });
  } else {
    await prisma.homepage.create({ data: homepagePayload });
  }

  const aboutPayload = {
    title: c.tagline,
    description: c.detailedDescription || c.description,
    image: null,
  };
  const about = await prisma.about.findFirst();
  if (about) {
    await prisma.about.update({ where: { id: about.id }, data: aboutPayload });
  } else {
    await prisma.about.create({ data: aboutPayload });
  }

  const settingsPayload = {
    siteName: c.name,
    siteEmail: c.contact?.email ?? null,
    sitePhone: c.contact?.phone ?? null,
    address: c.contact?.address ?? null,
    theme: 'light',
    logoUrl: null,
    facebook: null,
    twitter: c.socials?.twitter ?? null,
    linkedin: c.socials?.linkedin ?? null,
    instagram: null,
  };
  const settings = await prisma.settings.findFirst();
  if (settings) {
    await prisma.settings.update({
      where: { id: settings.id },
      data: settingsPayload,
    });
  } else {
    await prisma.settings.create({ data: settingsPayload });
  }
}

async function main() {
  console.log('Seeding website content...\n');
  console.log('  services     :', await seedServices());
  console.log('  industries   :', await seedIndustries());
  console.log('  case studies :', await seedCaseStudies());
  console.log('  blogs        :', await seedBlogs());
  console.log('  testimonials :', await seedTestimonials());
  console.log('  team members :', await seedTeam());
  console.log('  faqs         :', await seedFaqs());
  await seedSingletons();
  console.log('  homepage / about / settings: ok');
  console.log('\nContent seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
