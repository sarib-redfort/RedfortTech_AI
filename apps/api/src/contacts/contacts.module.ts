import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import {
  ContactsAdminController,
  ContactsPublicController,
} from './contacts.controller';

@Module({
  controllers: [ContactsAdminController, ContactsPublicController],
  providers: [ContactsService],
})
export class ContactsModule {}
