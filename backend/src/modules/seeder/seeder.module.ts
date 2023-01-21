import { SettingModule } from '@modules/setting';
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Module({
  imports: [SettingModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
