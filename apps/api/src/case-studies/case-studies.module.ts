import { Module } from '@nestjs/common';
import { CaseStudiesService } from './case-studies.service';
import {
  CaseStudiesAdminController,
  CaseStudiesPublicController,
} from './case-studies.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [CaseStudiesAdminController, CaseStudiesPublicController],
  providers: [CaseStudiesService],
})
export class CaseStudiesModule {}
