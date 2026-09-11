import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Status } from '@prisma/client';
import { MAX_PAGE_SIZE } from '../common/dto/pagination.dto';
import {
  paginated,
  type ResolvedPagination,
} from '../common/utils/pagination.util';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  private parsePagination(query: Record<string, any> = {}) {
    const page = query.page;
    const limit = query.limit; 
    const parsedPage =
      typeof page === 'string' && /^\d+$/.test(page) ? Number(page) : 1;
    // FAQs parse their own query (because `page` doubles as a target-page
    // filter), so the shared DTO's cap must be applied here as well.
    const parsedLimit = Math.min(
      typeof limit === 'string' && /^\d+$/.test(limit) ? Number(limit) : 10,
      MAX_PAGE_SIZE,
    );

    return {
      page: parsedPage,
      limit: parsedLimit,
      search: typeof query.search === 'string' ? query.search : undefined,
      sort: typeof query.sort === 'string' ? query.sort : 'createdAt',
      order: query.order === 'asc' ? 'asc' : 'desc',
    };
  }

  private buildWhere(query: Record<string, any> = {}, status?: Status) {
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

  /**
   * Shared list query. The admin and public variants differ only in whether
   * inactive FAQs are included.
   */
  private async findAll(query: Record<string, any>, status?: Status) {
    const { page, limit, search, sort, order } = this.parsePagination(query);
    const pagination: ResolvedPagination = {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort]: order as 'asc' | 'desc' },
      search,
    };

    const where = this.buildWhere({ ...query, search }, status);

    const [data, total] = await Promise.all([
      this.prisma.fAQ.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: pagination.orderBy,
      }),
      this.prisma.fAQ.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findAllAdmin(query: Record<string, any> = {}) {
    return this.findAll(query);
  }

  async findAllPublic(query: Record<string, any> = {}) {
    return this.findAll(query, Status.Active);
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
