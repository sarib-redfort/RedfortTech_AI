import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { ParseImageFilePipe } from '../common/pipes/parse-image-file.pipe';
@ApiTags('Uploads')
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin/upload/:folder')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    // Every other controller validates uploads through this pipe; without it
    // this endpoint accepted any file of any size or type, including SVG.
    @UploadedFile(ParseImageFilePipe) file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    // Valid folders based on requirements
    const validFolders = [
      'blogs',
      'case-studies',
      'services',
      'testimonials',
      'homepage',
      'about',
      'avatars',
      'logos',
    ];
    if (!validFolders.includes(folder)) {
      folder = 'misc';
    }
    return this.uploadService.uploadFile(file, folder);
  }

  // Serves legacy images that were stored on disk before uploads moved to
  // Cloudinary. New uploads never land here.
  @Get('public/uploads/:folder/:filename')
  @ApiOperation({ summary: 'Get an uploaded image' })
  getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const uploadsRoot = path.resolve(process.cwd(), 'uploads');
    const filePath = path.resolve(uploadsRoot, folder, filename);

    // Express decodes percent-escapes in route params, so `%2e%2e` arrives as
    // `..`. Without this check the path could escape the uploads directory and
    // serve any file on the host, including .env. Compare the resolved path
    // against the root rather than inspecting the raw segments.
    const isInsideUploads =
      filePath === uploadsRoot ||
      filePath.startsWith(uploadsRoot + path.sep);
    if (!isInsideUploads) {
      return res.status(404).send('File not found');
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(filePath);
  }
}
