import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Blog content as text/HTML',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
