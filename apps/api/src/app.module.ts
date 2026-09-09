import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { BlogsModule } from './blogs/blogs.module';
import { CaseStudiesModule } from './case-studies/case-studies.module';
import { ServicesModule } from './services/services.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqsModule } from './faqs/faqs.module';
import { ContactsModule } from './contacts/contacts.module';
import { HomepageModule } from './homepage/homepage.module';
import { AboutModule } from './about/about.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IndustriesModule } from './industries/industries.module';
import { TeamModule } from './team/team.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    UploadModule,
    BlogsModule,
    CaseStudiesModule,
    ServicesModule,
    TestimonialsModule,
    FaqsModule,
    ContactsModule,
    HomepageModule,
    AboutModule,
    SettingsModule,
    DashboardModule,
    IndustriesModule,
    TeamModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
