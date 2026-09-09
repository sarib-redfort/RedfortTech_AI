import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, ['name', 'email', 'subject']);

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.contact.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) throw new NotFoundException('Contact message not found');
    return contact;
  }

  async updateStatus(id: string, updateContactDto: UpdateContactDto) {
    await this.findOne(id); // Check existence
    return this.prisma.contact.update({
      where: { id },
      data: { status: updateContactDto.status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Contact message deleted successfully' };
  }
}
