import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFaqDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiPropertyOptional({ description: 'Page routing key', example: 'HOME' })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Associated service ID', example: 'service-uuid' })
  @IsString()
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
