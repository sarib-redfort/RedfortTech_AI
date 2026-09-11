import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface SitemapEntry {
  path: string;
  lastModified?: Date | null;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

/**
 * Builds sitemap.xml from published content.
 *
 * Generated rather than checked in as a static file: blog posts, case studies,
 * services and industries are created in the CMS, so a hand-maintained sitemap
 * would be stale the moment an editor publishes anything.
 */
@Injectable()
export class SitemapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Public origin of the website, without a trailing slash. */
  private siteUrl(): string {
    const raw = this.config.get<string>('SITE_URL') ?? 'http://localhost:3000';
    return raw.replace(/\/+$/, '');
  }

  private static readonly STATIC_ROUTES: SitemapEntry[] = [
    { path: '/', changeFrequency: 'weekly', priority: '1.0' },
    { path: '/about', changeFrequency: 'monthly', priority: '0.8' },
    { path: '/services', changeFrequency: 'weekly', priority: '0.9' },
    { path: '/industries', changeFrequency: 'monthly', priority: '0.8' },
    { path: '/case-studies', changeFrequency: 'weekly', priority: '0.8' },
    { path: '/blog', changeFrequency: 'daily', priority: '0.8' },
    { path: '/contact', changeFrequency: 'monthly', priority: '0.7' },
    { path: '/careers', changeFrequency: 'weekly', priority: '0.6' },
  ];

  async generate(): Promise<string> {
    const active = { status: Status.Active };

    const [blogs, caseStudies, services, industries] = await Promise.all([
      this.prisma.blog.findMany({
        where: active,
        select: { slug: true, updatedAt: true },
      }),
      this.prisma.caseStudy.findMany({
        where: active,
        select: { slug: true, updatedAt: true },
      }),
      this.prisma.service.findMany({
        where: active,
        select: { id: true, updatedAt: true },
      }),
      this.prisma.industry.findMany({
        where: active,
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const entries: SitemapEntry[] = [
      ...SitemapService.STATIC_ROUTES,
      ...blogs.map((b) => ({
        path: `/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: '0.7',
      })),
      ...caseStudies.map((c) => ({
        path: `/case-studies/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: '0.7',
      })),
      ...services.map((s) => ({
        path: `/services/${s.id}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: '0.7',
      })),
      // Industries render on the /industries page rather than their own route,
      // so they are represented by that page and not listed individually.
    ];

    void industries;

    return this.render(entries);
  }

  private render(entries: SitemapEntry[]): string {
    const base = this.siteUrl();

    const urls = entries
      .map((entry) => {
        const lastMod = entry.lastModified
          ? `\n    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>`
          : '';
        return (
          '  <url>\n' +
          `    <loc>${escapeXml(base + entry.path)}</loc>${lastMod}\n` +
          `    <changefreq>${entry.changeFrequency}</changefreq>\n` +
          `    <priority>${entry.priority}</priority>\n` +
          '  </url>'
        );
      })
      .join('\n');

    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      `${urls}\n` +
      '</urlset>\n'
    );
  }
}

/** Slugs are URL-safe, but escaping keeps the document valid regardless. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
