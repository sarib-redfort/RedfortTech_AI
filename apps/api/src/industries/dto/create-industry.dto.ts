import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateIndustryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;

  @ApiProperty({ type: 'string', description: 'Industry description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    type: [String],
    description: 'Array of segment benefits',
    example: ['Benefit 1', 'Benefit 2'],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      } catch (err) {
        // Fallback to wrapping as a single item array
      }
      return [value];
    }
    return value as string[];
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  segmentBenefits!: string[];

  @ApiPropertyOptional({
    type: 'string',
    description: 'Icon name',
    example: 'Building2',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ enum: Status, default: Status.Active })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
