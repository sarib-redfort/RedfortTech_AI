import { Status } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { generateSlug } from '../common/utils/slug.util';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  private async getUniqueSlug(baseSlug: string, id?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.blog.findUnique({ where: { slug } });
      if (!existing || (id && existing.id === id)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(createBlogDto: CreateBlogDto) {
    const baseSlug = generateSlug(createBlogDto.title);
    const slug = await this.getUniqueSlug(baseSlug);

    return this.prisma.blog.create({
      data: {
        ...createBlogDto,
        slug,
        publishedAt: createBlogDto.publishedAt
          ? new Date(createBlogDto.publishedAt)
          : null,
      },
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, 'title');

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'publishedAt');
    const { skip, take, orderBy, search } = pagination;

    const where = { status: Status.Active, ...searchFilter(search, 'title') };

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findOne(idOrSlug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    await this.findOne(id); // Check existence

    const data: any = { ...updateBlogDto };

    if (updateBlogDto.title) {
      const baseSlug = generateSlug(updateBlogDto.title);
      data.slug = await this.getUniqueSlug(baseSlug, id);
    }

    if (updateBlogDto.publishedAt !== undefined) {
      data.publishedAt = updateBlogDto.publishedAt
        ? new Date(updateBlogDto.publishedAt)
        : null;
    }

    return this.prisma.blog.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }
}
