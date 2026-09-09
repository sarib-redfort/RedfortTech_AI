import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsAdminController, FaqsPublicController } from './faqs.controller';

@Module({
  controllers: [FaqsAdminController, FaqsPublicController],
  providers: [FaqsService],
})
export class FaqsModule {}
