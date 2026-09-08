import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async create(createAboutDto: CreateAboutDto) {
    const count = await this.prisma.about.count();
    if (count > 0) {
      throw new ConflictException('About configuration already exists');
    }

    return this.prisma.about.create({
      data: createAboutDto,
    });
  }

  async findOne() {
    const about = await this.prisma.about.findFirst();
    if (!about) {
      throw new NotFoundException('About configuration not found');
    }
    return about;
  }

  async update(updateAboutDto: UpdateAboutDto) {
    const about = await this.prisma.about.findFirst();
    if (!about) {
      throw new NotFoundException('About configuration not found');
    }

    return this.prisma.about.update({
      where: { id: about.id },
      data: updateAboutDto,
    });
  }
}
