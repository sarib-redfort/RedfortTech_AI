import {
  Injectable,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              reject(new Error(error.message || 'Upload failed'));
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload failed with no result'));
            }
          },
        );
        uploadStream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        path: result.secure_url,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown upload error';
      throw new InternalServerErrorException(
        `Failed to upload image to Cloudinary: ${message}`,
      );
    }
  }
}
