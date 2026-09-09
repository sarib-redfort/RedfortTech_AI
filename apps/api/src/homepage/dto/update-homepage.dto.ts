import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHomepageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
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
