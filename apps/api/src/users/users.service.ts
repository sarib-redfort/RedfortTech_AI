import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  paginated,
  resolvePagination,
  searchFilter,
} from '../common/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(paginationDto: PaginationDto) {
    const pagination = resolvePagination(paginationDto, 'createdAt');
    const { skip, take, orderBy, search } = pagination;

    const where = searchFilter(search, ['name', 'email']);

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginated(data, total, pagination);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existing = await this.findOne(id);

    // Demoting or deactivating the only active Admin locks everyone out of
    // user management just as surely as deleting them.
    const losesAdmin =
      (updateUserDto.role && updateUserDto.role !== Role.Admin) ||
      (updateUserDto.status && updateUserDto.status !== Status.Active);

    if (losesAdmin) {
      await this.assertNotLastActiveAdmin(
        existing,
        'Cannot demote or deactivate the last active administrator.',
      );
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: string, actingUserId?: string) {
    const user = await this.findOne(id);

    if (actingUserId && actingUserId === id) {
      throw new BadRequestException(
        'You cannot delete your own account. Ask another administrator.',
      );
    }

    await this.assertNotLastActiveAdmin(
      user,
      'Cannot delete the last active administrator.',
    );

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  /**
   * Guards against removing the final route into the admin panel.
   *
   * Deleting, demoting, or deactivating the only remaining active Admin would
   * leave the CMS with no one able to manage users.
   */
  private async assertNotLastActiveAdmin(
    user: { id: string; role: Role; status: Status },
    message: string,
  ) {
    if (user.role !== Role.Admin || user.status !== Status.Active) return;

    const otherActiveAdmins = await this.prisma.user.count({
      where: {
        id: { not: user.id },
        role: Role.Admin,
        status: Status.Active,
      },
    });

    if (otherActiveAdmins === 0) {
      throw new BadRequestException(message);
    }
  }
}
