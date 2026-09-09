import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomepageDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';

@Injectable()
export class HomepageService {
  constructor(private prisma: PrismaService) {}

  async create(createHomepageDto: CreateHomepageDto) {
    const count = await this.prisma.homepage.count();
    if (count > 0) {
      throw new ConflictException('Homepage configuration already exists');
    }

    return this.prisma.homepage.create({
      data: createHomepageDto,
    });
  }

  async findOne() {
    const homepage = await this.prisma.homepage.findFirst();
    if (!homepage) {
      throw new NotFoundException('Homepage configuration not found');
    }
    return homepage;
  }

  async update(updateHomepageDto: UpdateHomepageDto) {
    const homepage = await this.prisma.homepage.findFirst();
    if (!homepage) {
      throw new NotFoundException('Homepage configuration not found');
    }

    return this.prisma.homepage.update({
      where: { id: homepage.id },
      data: updateHomepageDto,
    });
  }
}
