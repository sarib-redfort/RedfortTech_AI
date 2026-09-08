import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import {
  SettingsAdminController,
  SettingsPublicController,
} from './settings.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [SettingsAdminController, SettingsPublicController],
  providers: [SettingsService],
})
export class SettingsModule {}
