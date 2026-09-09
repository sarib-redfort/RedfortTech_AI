import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: 'Page routing key', example: 'HOME' })
  @IsString()
  @IsNotEmpty()
  page: string;

  @ApiPropertyOptional({ description: 'Associated service ID', example: 'service-uuid' })
  @IsString()
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.Active })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
