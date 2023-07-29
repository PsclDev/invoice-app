import { ClientModule } from '@modules/client';
import { DocumentModule } from '@modules/document';
import { SettingModule } from '@modules/setting';
import { Module } from '@nestjs/common';

import { SeederService } from './seeder.service';

@Module({
  imports: [ClientModule, DocumentModule, SettingModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
