import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import {
  TestimonialsAdminController,
  TestimonialsPublicController,
} from './testimonials.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [TestimonialsAdminController, TestimonialsPublicController],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
