import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
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

@ApiTags('Admin / Industries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/industries')
export class IndustriesAdminController {
  constructor(
    private readonly industriesService: IndustriesService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new industry' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createIndustryDto: CreateIndustryDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'industries',
      );
      createIndustryDto.image = uploadResult.path;
    }
    return this.industriesService.create(createIndustryDto);
  }

  @ApiOperation({
    summary: 'Get all industries with pagination and search (Admin)',
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.industriesService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Update an industry' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'industries',
      );
      updateIndustryDto.image = uploadResult.path;
    }
    return this.industriesService.update(id, updateIndustryDto);
  }

  @ApiOperation({ summary: 'Delete an industry' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.industriesService.remove(id);
  }
}

@ApiTags('Public / Industries')
@Controller('public/industries')
export class IndustriesPublicController {
  constructor(private readonly industriesService: IndustriesService) {}

  @ApiOperation({ summary: 'Get all active industries with pagination' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.industriesService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Get an industry by slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.industriesService.findOneBySlug(slug);
  }
}
