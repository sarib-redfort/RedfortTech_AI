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

    // SVG is deliberately excluded: it is an XML document that can carry
    // <script> and event handlers, so an uploaded .svg opened directly from
    // the API origin executes as script. Raster formats cannot do this.
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
    ];
    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, WEBP and AVIF images are allowed',
      );
    }

    // The declared MIME type comes from the client and is trivially spoofed,
    // so confirm the bytes actually start with a known image signature.
    if (Buffer.isBuffer(value.buffer) && !this.hasImageMagicBytes(value.buffer)) {
      throw new BadRequestException(
        'File content does not match a supported image format',
      );
    }

    return value;
  }

  /** Checks the leading bytes against the signatures of the allowed formats. */
  private hasImageMagicBytes(buffer: Buffer): boolean {
    if (buffer.length < 12) return false;

    const startsWith = (...bytes: number[]) =>
      bytes.every((b, i) => buffer[i] === b);

    const isJpeg = startsWith(0xff, 0xd8, 0xff);
    const isPng = startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    const isGif = startsWith(0x47, 0x49, 0x46, 0x38);
    // WEBP and AVIF are container formats: "RIFF....WEBP" and "....ftyp".
    const isRiff = startsWith(0x52, 0x49, 0x46, 0x46);
    const isWebp = isRiff && buffer.toString('ascii', 8, 12) === 'WEBP';
    const isAvif = buffer.toString('ascii', 4, 8) === 'ftyp';

    return isJpeg || isPng || isGif || isWebp || isAvif;
  }
}
