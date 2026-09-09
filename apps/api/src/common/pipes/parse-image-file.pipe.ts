import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return value; // File is optional
    }

    // Check size limit: max 5MB (5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (value.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    // Check MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, WEBP, and SVG are allowed',
      );
    }

    return value;
  }
}
