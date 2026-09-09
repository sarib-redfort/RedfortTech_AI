import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  ServicesAdminController,
  ServicesPublicController,
} from './services.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [ServicesAdminController, ServicesPublicController],
  providers: [ServicesService],
})
export class ServicesModule {}
