import { Module } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import {
  HomepageAdminController,
  HomepagePublicController,
} from './homepage.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [HomepageAdminController, HomepagePublicController],
  providers: [HomepageService],
})
export class HomepageModule {}
