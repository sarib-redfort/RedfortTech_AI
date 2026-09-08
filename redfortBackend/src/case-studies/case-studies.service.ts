import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class CaseStudiesService {
  constructor(private prisma: PrismaService) {}

  private async getUniqueSlug(baseSlug: string, id?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.caseStudy.findUnique({
        where: { slug },
      });
      if (!existing || (id && existing.id === id)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(createCaseStudyDto: CreateCaseStudyDto) {
    const baseSlug = generateSlug(createCaseStudyDto.title);
    const slug = await this.getUniqueSlug(baseSlug);

    return this.prisma.caseStudy.create({
      data: {
        ...createCaseStudyDto,
        slug,
      },
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? { title: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.caseStudy.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { status: 'Active' };
    if (search) {
      where.title = { contains: search, mode: 'insensitive' as const };
    }

    const [data, total] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.caseStudy.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(idOrSlug: string) {
    const caseStudy = await this.prisma.caseStudy.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!caseStudy) throw new NotFoundException('Case Study not found');
    return caseStudy;
  }

  async update(id: string, updateCaseStudyDto: UpdateCaseStudyDto) {
    await this.findOne(id); // Check existence

    const data: any = { ...updateCaseStudyDto };

    if (updateCaseStudyDto.title) {
      const baseSlug = generateSlug(updateCaseStudyDto.title);
      data.slug = await this.getUniqueSlug(baseSlug, id);
    }

    return this.prisma.caseStudy.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.caseStudy.delete({ where: { id } });
    return { message: 'Case Study deleted successfully' };
  }
}
