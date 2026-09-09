import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDto) {
    const count = await this.prisma.settings.count();
    if (count > 0) {
      throw new ConflictException('Settings configuration already exists');
    }

    return this.prisma.settings.create({
      data: createSettingDto,
    });
  }

  async findOne() {
    const settings = await this.prisma.settings.findFirst();
    if (!settings) {
      throw new NotFoundException('Settings configuration not found');
    }
    return settings;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const settings = await this.prisma.settings.findFirst();
    if (!settings) {
      throw new NotFoundException('Settings configuration not found');
    }

    return this.prisma.settings.update({
      where: { id: settings.id },
      data: updateSettingDto,
    });
  }
}
