import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      users,
      blogs,
      caseStudies,
      services,
      testimonials,
      faqs,
      teamMembers,
      industries,
      unreadContacts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.blog.count(),
      this.prisma.caseStudy.count(),
      this.prisma.service.count(),
      this.prisma.testimonial.count(),
      this.prisma.fAQ.count(),
      this.prisma.teamMember.count(),
      this.prisma.industry.count(),
      this.prisma.contact.count({ where: { status: 'Unread' } }),
    ]);

    const recentBlogs = await this.prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        image: true,
        createdAt: true,
      },
    });

    const recentContacts = await this.prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      counts: {
        users,
        blogs,
        caseStudies,
        services,
        testimonials,
        faqs,
        teamMembers,
        industries,
        unreadContacts,
      },
      recentActivity: {
        blogs: recentBlogs,
        contacts: recentContacts,
      },
    };
  }
}
