import { SettingModule } from '@modules/setting/setting.module';
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Module({
  imports: [SettingModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
