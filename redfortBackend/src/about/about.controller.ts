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
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
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

@ApiTags('Admin / About')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/about')
export class AboutAdminController {
  constructor(
    private readonly aboutService: AboutService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create about configuration (only once)' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createAboutDto: CreateAboutDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'about');
      createAboutDto.image = uploadResult.path;
    }
    return this.aboutService.create(createAboutDto);
  }

  @ApiOperation({ summary: 'Get about configuration' })
  @Get()
  findOne() {
    return this.aboutService.findOne();
  }

  @ApiOperation({ summary: 'Update about configuration' })
  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() updateAboutDto: UpdateAboutDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'about');
      updateAboutDto.image = uploadResult.path;
    }
    return this.aboutService.update(updateAboutDto);
  }
}

@ApiTags('Public / About')
@Controller('public/about')
export class AboutPublicController {
  constructor(private readonly aboutService: AboutService) {}

  @ApiOperation({ summary: 'Get about configuration' })
  @Get()
  findOne() {
    return this.aboutService.findOne();
  }
}
