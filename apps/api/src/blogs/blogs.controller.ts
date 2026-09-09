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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
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

@ApiTags('Admin / Blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/blogs')
export class BlogsAdminController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new blog' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'blogs');
      createBlogDto.image = uploadResult.path;
    }
    return this.blogsService.create(createBlogDto);
  }

  @ApiOperation({ summary: 'Get all blogs with pagination and search (Admin)' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogsService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a blog by ID or Slug' })
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.blogsService.findOne(idOrSlug);
  }

  @ApiOperation({ summary: 'Update a blog' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'blogs');
      updateBlogDto.image = uploadResult.path;
    }
    return this.blogsService.update(id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Delete a blog' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}

@ApiTags('Public / Blogs')
@Controller('public/blogs')
export class BlogsPublicController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiOperation({ summary: 'Get all active blogs with pagination' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogsService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Get a blog by Slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }
}
