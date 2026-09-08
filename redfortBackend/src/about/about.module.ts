import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import {
  AboutAdminController,
  AboutPublicController,
} from './about.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [AboutAdminController, AboutPublicController],
  providers: [AboutService],
})
export class AboutModule {}
