import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogsAdminController,
  BlogsPublicController,
} from './blogs.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BlogsAdminController, BlogsPublicController],
  providers: [BlogsService],
})
export class BlogsModule {}
