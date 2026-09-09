import {
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role, Status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // bcrypt ignores anything past 72 bytes, so a longer value would be
  // silently truncated rather than fully checked at login.
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(72, { message: 'Password must not exceed 72 characters' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.ContentWriter })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ enum: Status, default: Status.Active })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;
}
