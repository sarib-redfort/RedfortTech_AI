import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Status } from '@prisma/client';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: createTeamMemberDto,
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'displayOrder', 'asc');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, ['name', 'role']);

    const [data, total] = await Promise.all([
      this.prisma.teamMember.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.teamMember.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findAllPublic() {
    return this.prisma.teamMember.findMany({
      where: { status: Status.Active },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async findOnePublic(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member || member.status !== Status.Active) {
      throw new NotFoundException('Team member not found');
    }
    return member;
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    await this.findOne(id); // Check existence
    return this.prisma.teamMember.update({
      where: { id },
      data: updateTeamMemberDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.teamMember.delete({ where: { id } });
    return { message: 'Team member deleted successfully' };
  }
}
