import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamAdminController, TeamPublicController } from './team.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [TeamAdminController, TeamPublicController],
  providers: [TeamService],
})
export class TeamModule {}
