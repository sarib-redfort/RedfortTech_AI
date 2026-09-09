import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SanitizeHtml } from '../../common/decorators/sanitize-html.decorator';

export class UpdateAboutDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @SanitizeHtml()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;
}
