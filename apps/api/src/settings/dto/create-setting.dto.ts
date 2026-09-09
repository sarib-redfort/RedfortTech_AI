import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  siteName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  siteEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sitePhone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instagram?: string;
}
