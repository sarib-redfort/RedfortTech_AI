import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SanitizeHtml } from '../../common/decorators/sanitize-html.decorator';

export class UpdateHomepageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @SanitizeHtml()
  heroDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heroImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  buttonText?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  happyClients?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  industriesServed?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  clientSatisfaction?: number;
}
