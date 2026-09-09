import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async create(createTestimonialDto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: createTestimonialDto,
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, ['name', 'company']);

    const [data, total] = await Promise.all([
      this.prisma.testimonial.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.testimonial.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findAllPublic() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    await this.findOne(id); // Check existence
    return this.prisma.testimonial.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.testimonial.delete({ where: { id } });
    return { message: 'Testimonial deleted successfully' };
  }
}
