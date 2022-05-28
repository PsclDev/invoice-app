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
        'Invoice Subject',
      );
      this.logger.warn('Settings already seeded...');
    } catch (error) {
      if (error.status === 404) {
        const invoiceSubject: CreateSettingDto = {
          type: SettingType.MAIL,
          key: 'Invoice Subject',
          value: '',
        };

        const invoiceText: CreateSettingDto = {
          type: SettingType.MAIL,
          key: 'Invoice Text',
          value: '',
        };

        const offerSubject: CreateSettingDto = {
          type: SettingType.MAIL,
          key: 'Offer Subject',
          value: '',
        };

        const offerText: CreateSettingDto = {
          type: SettingType.MAIL,
          key: 'Offer Text',
          value: '',
        };

        await this.settingService.createSetting(invoiceSubject, false);
        await this.settingService.createSetting(invoiceText, false);
        await this.settingService.createSetting(offerSubject, false);
        await this.settingService.createSetting(offerText, false);
      }
    }
  }

  private async devData() {
    //
  }
}
