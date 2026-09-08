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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
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

@ApiTags('Admin / Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/services')
export class ServicesAdminController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new service' })
  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'services',
      );
      createServiceDto.icon = uploadResult.path;
    }
    return this.servicesService.create(createServiceDto);
  }

  @ApiOperation({ summary: 'Get all services with pagination (Admin)' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.servicesService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a service by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a service' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(
        file,
        'services',
      );
      updateServiceDto.icon = uploadResult.path;
    }
    return this.servicesService.update(id, updateServiceDto);
  }

  @ApiOperation({ summary: 'Delete a service' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}

@ApiTags('Public / Services')
@Controller('public/services')
export class ServicesPublicController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Get all active services with pagination' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.servicesService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Get a service by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }
}
