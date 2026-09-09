import { Status } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, 'title');

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.service.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = { status: Status.Active, ...searchFilter(search, 'title') };

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.service.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id); // Check existence
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.service.delete({ where: { id } });
    return { message: 'Service deleted successfully' };
  }
}
