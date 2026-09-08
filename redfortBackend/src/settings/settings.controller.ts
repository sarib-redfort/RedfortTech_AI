import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { ParseImageFilePipe } from '../common/pipes/parse-image-file.pipe';

@ApiTags('Admin / Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // Only Admin can manage settings
@Controller('admin/settings')
export class SettingsAdminController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create settings configuration (only once)' })
  @Post()
  @UseInterceptors(FileInterceptor('logoUrl'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createSettingDto: CreateSettingDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'logos');
      createSettingDto.logoUrl = uploadResult.path;
    }
    return this.settingsService.create(createSettingDto);
  }

  @ApiOperation({ summary: 'Get settings configuration' })
  @Get()
  findOne() {
    return this.settingsService.findOne();
  }

  @ApiOperation({ summary: 'Update settings configuration' })
  @Patch()
  @UseInterceptors(FileInterceptor('logoUrl'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() updateSettingDto: UpdateSettingDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'logos');
      updateSettingDto.logoUrl = uploadResult.path;
    }
    return this.settingsService.update(updateSettingDto);
  }
}

// Public endpoint if required (e.g. for footer links, logo)
@ApiTags('Public / Settings')
@Controller('public/settings')
export class SettingsPublicController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Get public settings configuration' })
  @Get()
  findOne() {
    return this.settingsService.findOne();
  }
}
