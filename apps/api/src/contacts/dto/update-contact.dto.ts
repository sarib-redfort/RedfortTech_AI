import { IsEnum, IsNotEmpty } from 'class-validator';
import { ContactStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiProperty({ enum: ContactStatus })
  @IsEnum(ContactStatus)
  @IsNotEmpty()
  status: ContactStatus;
}
