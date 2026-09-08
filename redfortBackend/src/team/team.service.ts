import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Status } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: createTeamMemberDto,
    });
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'displayOrder',
      order = 'asc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { role: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.teamMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.teamMember.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
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
