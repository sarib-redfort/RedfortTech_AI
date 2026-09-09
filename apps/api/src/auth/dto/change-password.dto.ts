import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'The password currently in use' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ minLength: 8, description: 'The replacement password' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  // bcrypt silently truncates input beyond 72 bytes, so reject longer values
  // instead of accepting a password whose tail is ignored.
  @MaxLength(72, { message: 'New password must not exceed 72 characters' })
  newPassword: string;
}
