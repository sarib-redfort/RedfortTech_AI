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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
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

@ApiTags('Admin / Testimonials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/testimonials')
export class TestimonialsAdminController {
  constructor(
    private readonly testimonialsService: TestimonialsService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new testimonial' })
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'testimonials',
      );
      createTestimonialDto.avatar = uploadResult.path;
    }
    return this.testimonialsService.create(createTestimonialDto);
  }

  @ApiOperation({ summary: 'Get all testimonials with pagination (Admin)' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.testimonialsService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a testimonial by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a testimonial' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'testimonials',
      );
      updateTestimonialDto.avatar = uploadResult.path;
    }
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @ApiOperation({ summary: 'Delete a testimonial' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}

@ApiTags('Public / Testimonials')
@Controller('public/testimonials')
export class TestimonialsPublicController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @ApiOperation({ summary: 'Get all testimonials' })
  @Get()
  findAll() {
    return this.testimonialsService.findAllPublic();
  }
}
