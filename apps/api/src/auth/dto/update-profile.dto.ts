import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Fields a signed-in user may change about themselves.
 *
 * Deliberately excludes `role` and `status`: those are administrative and
 * live on the admin users endpoint. Including them here would let any
 * content writer promote themselves to Admin.
 */
export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;
}
