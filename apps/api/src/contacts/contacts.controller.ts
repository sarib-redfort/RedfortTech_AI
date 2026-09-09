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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin / Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // Only Admin can manage contacts
@Controller('admin/contacts')
export class ContactsAdminController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Get all contact messages (Admin)' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contactsService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a contact message by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update contact status' })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateStatus(id, updateContactDto);
  }

  @ApiOperation({ summary: 'Delete a contact message' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}

@ApiTags('Public / Contacts')
@Controller('public/contacts')
export class ContactsPublicController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Submit a new contact message' })
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }
}
