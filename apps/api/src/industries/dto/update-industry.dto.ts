import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SanitizeHtml } from '../../common/decorators/sanitize-html.decorator';

export class UpdateIndustryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Industry description' })
  @IsString()
  @IsOptional()
  @SanitizeHtml()
  description?: string;

  @ApiPropertyOptional({
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
  @IsOptional()
  segmentBenefits?: string[];

  @ApiPropertyOptional({
    type: 'string',
    description: 'Icon name',
    example: 'Building2',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
