import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateTeamMemberDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  twitterUrl?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({ type: 'integer' })
  @Transform(({ value }) =>
    value !== undefined && value !== null ? Number(value) : undefined,
  )
  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
