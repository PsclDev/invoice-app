import { ConfigService } from '@config/config.service';
import { CreateSettingDto, SettingType } from '@modules/setting/setting.dto';
import { SettingService } from '@modules/setting/setting.service';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly settingService: SettingService,
  ) {}

  async onApplicationBootstrap() {
    await this.baseData();

    if (this.configService.devMode && !this.configService.disableSeeding)
      await this.devData();
    else this.logger.log('Disbaled development seeding');
  }

  private async baseData() {
    this.logger.log('Seeding Basedata to the database');
    await this.settingData();
  }

  private async settingData() {
    try {
      this.logger.log('Seeding Settings...');
      await this.settingService.findByTypeAndKey(
        SettingType.MAIL,
        'Subject German',
      );

      const subjectGerman: CreateSettingDto = {
        type: SettingType.MAIL,
        key: 'Subject German',
        value: '',
      };

      const subjectEnglish: CreateSettingDto = {
        type: SettingType.MAIL,
        key: 'Subject English',
        value: '',
      };

      const textGerman: CreateSettingDto = {
        type: SettingType.MAIL,
        key: 'Text German',
        value: '',
      };

      const textEnglish: CreateSettingDto = {
        type: SettingType.MAIL,
        key: 'Text English',
        value: '',
      };

      await this.settingService.createSetting(subjectGerman, false);
      await this.settingService.createSetting(subjectEnglish, false);
      await this.settingService.createSetting(textGerman, false);
      await this.settingService.createSetting(textEnglish, false);
    } catch (error) {
      this.logger.log('Settings already seeded...');
    }
  }

  private async devData() {
    //
  }
}
