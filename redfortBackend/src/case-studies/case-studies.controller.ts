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
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
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

@ApiTags('Admin / Case Studies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/case-studies')
export class CaseStudiesAdminController {
  constructor(
    private readonly caseStudiesService: CaseStudiesService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new case study' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createCaseStudyDto: CreateCaseStudyDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'case-studies',
      );
      createCaseStudyDto.image = uploadResult.path;
    }
    return this.caseStudiesService.create(createCaseStudyDto);
  }

  @ApiOperation({ summary: 'Get all case studies with pagination (Admin)' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.caseStudiesService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a case study by ID or Slug' })
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.caseStudiesService.findOne(idOrSlug);
  }

  @ApiOperation({ summary: 'Update a case study' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateCaseStudyDto: UpdateCaseStudyDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'case-studies',
      );
      updateCaseStudyDto.image = uploadResult.path;
    }
    return this.caseStudiesService.update(id, updateCaseStudyDto);
  }

  @ApiOperation({ summary: 'Delete a case study' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseStudiesService.remove(id);
  }
}

@ApiTags('Public / Case Studies')
@Controller('public/case-studies')
export class CaseStudiesPublicController {
  constructor(private readonly caseStudiesService: CaseStudiesService) {}

  @ApiOperation({ summary: 'Get all active case studies with pagination' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.caseStudiesService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Get a case study by Slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.caseStudiesService.findOne(slug);
  }
}
