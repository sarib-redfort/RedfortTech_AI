import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class IndustriesService {
  constructor(private prisma: PrismaService) {}

  private async getUniqueSlug(baseSlug: string, id?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.industry.findUnique({
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

  async create(createIndustryDto: CreateIndustryDto) {
    const baseSlug = generateSlug(createIndustryDto.title);
    const slug = await this.getUniqueSlug(baseSlug);

    return this.prisma.industry.create({
      data: {
        title: createIndustryDto.title,
        slug,
        image: createIndustryDto.image,
        description: createIndustryDto.description,
        segmentBenefits: createIndustryDto.segmentBenefits,
        icon: createIndustryDto.icon,
        status: createIndustryDto.status,
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
      this.prisma.industry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.industry.count({ where }),
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
      this.prisma.industry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.industry.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneBySlug(slug: string) {
    const industry = await this.prisma.industry.findUnique({ where: { slug } });
    if (!industry) throw new NotFoundException('Industry not found');
    return industry;
  }

  async findOne(id: string) {
    const industry = await this.prisma.industry.findUnique({ where: { id } });
    if (!industry) throw new NotFoundException('Industry not found');
    return industry;
  }

  async update(id: string, updateIndustryDto: UpdateIndustryDto) {
    await this.findOne(id); // Check existence

    const data: any = { ...updateIndustryDto };

    if (updateIndustryDto.title) {
      const baseSlug = generateSlug(updateIndustryDto.title);
      data.slug = await this.getUniqueSlug(baseSlug, id);
    }

    return this.prisma.industry.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.industry.delete({ where: { id } });
    return { message: 'Industry deleted successfully' };
  }
}
