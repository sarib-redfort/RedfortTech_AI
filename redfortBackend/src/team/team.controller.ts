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
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
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

@ApiTags('Admin / Team Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.ContentWriter)
@Controller('admin/team')
export class TeamAdminController {
  constructor(
    private readonly teamService: TeamService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Create a new team member' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'team');
      createTeamMemberDto.image = uploadResult.path;
    }
    return this.teamService.create(createTeamMemberDto);
  }

  @ApiOperation({
    summary: 'Get all team members with pagination and search (Admin)',
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.teamService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Get a team member by ID (Admin)' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a team member' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @UploadedFile(ParseImageFilePipe) file?: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'team');
      updateTeamMemberDto.image = uploadResult.path;
    }
    return this.teamService.update(id, updateTeamMemberDto);
  }

  @ApiOperation({ summary: 'Delete a team member' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}

@ApiTags('Public / Team Members')
@Controller('public/team')
export class TeamPublicController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Get all active team members' })
  @Get()
  findAll() {
    return this.teamService.findAllPublic();
  }

  @ApiOperation({ summary: 'Get an active team member by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOnePublic(id);
  }
}
