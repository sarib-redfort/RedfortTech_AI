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
import { HomepageService } from './homepage.service';
import { CreateHomepageDto } from './dto/create-homepage.dto';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
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

@ApiTags('Admin / Homepage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/homepage')
export class HomepageAdminController {
  constructor(
    private readonly homepageService: HomepageService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create homepage configuration (only once)' })
  @Post()
  @UseInterceptors(FileInterceptor('heroImage'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createHomepageDto: CreateHomepageDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'homepage',
      );
      createHomepageDto.heroImage = uploadResult.path;
    }
    return this.homepageService.create(createHomepageDto);
  }

  @ApiOperation({ summary: 'Get homepage configuration' })
  @Get()
  findOne() {
    return this.homepageService.findOne();
  }

  @ApiOperation({ summary: 'Update homepage configuration' })
  @Patch()
  @UseInterceptors(FileInterceptor('heroImage'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() updateHomepageDto: UpdateHomepageDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'homepage',
      );
      updateHomepageDto.heroImage = uploadResult.path;
    }
    return this.homepageService.update(updateHomepageDto);
  }
}

@ApiTags('Public / Homepage')
@Controller('public/homepage')
export class HomepagePublicController {
  constructor(private readonly homepageService: HomepageService) {}

  @ApiOperation({ summary: 'Get homepage configuration' })
  @Get()
  findOne() {
    return this.homepageService.findOne();
  }
}
