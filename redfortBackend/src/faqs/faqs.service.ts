import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  private parsePagination(query: Record<string, any> = {}) {
    const page = query.page;
    const limit = query.limit; 
    const parsedPage =
      typeof page === 'string' && /^\d+$/.test(page) ? Number(page) : 1;
    const parsedLimit =
      typeof limit === 'string' && /^\d+$/.test(limit) ? Number(limit) : 10;

    return {
      page: parsedPage,
      limit: parsedLimit,
      search: typeof query.search === 'string' ? query.search : undefined,
      sort: typeof query.sort === 'string' ? query.sort : 'createdAt',
      order: query.order === 'asc' ? 'asc' : 'desc',
    };
  }

  private buildWhere(query: Record<string, any> = {}, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (typeof query.page === 'string' && !/^\d+$/.test(query.page)) {
      where.page = query.page;
    }

    if (typeof query.serviceId === 'string' && query.serviceId) {
      where.serviceId = query.serviceId;
    }

    if (typeof query.search === 'string' && query.search) {
      where.question = { contains: query.search, mode: 'insensitive' as const };
    }

    return where;
  } 

  async create(createFaqDto: CreateFaqDto) {
    return this.prisma.fAQ.create({
      data: createFaqDto,
    });
  }

  async findAllAdmin(query: Record<string, any> = {}) {
    const { page, limit, search, sort, order } = this.parsePagination(query);
    const skip = (page - 1) * limit;

    const where = this.buildWhere({ ...query, search }, undefined);

    const [data, total] = await Promise.all([
      this.prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.fAQ.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllPublic(query: Record<string, any> = {}) {
    const { page, limit, search, sort, order } = this.parsePagination(query);
    const skip = (page - 1) * limit;

    const where = this.buildWhere({ ...query, search }, 'Active');

    const [data, total] = await Promise.all([
      this.prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.fAQ.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    await this.findOne(id); // Check existence
    return this.prisma.fAQ.update({
      where: { id },
      data: updateFaqDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.fAQ.delete({ where: { id } });
    return { message: 'FAQ deleted successfully' };
  }
}
