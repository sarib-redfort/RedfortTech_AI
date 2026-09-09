import { Module } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import {
  IndustriesAdminController,
  IndustriesPublicController,
} from './industries.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [IndustriesAdminController, IndustriesPublicController],
  providers: [IndustriesService],
})
export class IndustriesModule {}
