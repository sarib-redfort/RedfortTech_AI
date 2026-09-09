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
} from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin / FAQs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/faqs')
export class FaqsAdminController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({ summary: 'Create a new FAQ' })
  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @ApiOperation({ summary: 'Get all FAQs with pagination (Admin)' })
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.faqsService.findAllAdmin(query);
  }

  @ApiOperation({ summary: 'Get an FAQ by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an FAQ' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @ApiOperation({ summary: 'Delete an FAQ' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}

@ApiTags('Public / FAQs')
@Controller(['faqs', 'public/faqs'])
export class FaqsPublicController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({ summary: 'Get all active FAQs with pagination' })
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.faqsService.findAllPublic(query);
  }

  @ApiOperation({ summary: 'Get an FAQ by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }
}
