import { ConfigService } from '@config';
import {
  CreateSettingDto,
  SettingService,
  SettingType,
} from '@modules/setting';
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

        const companyName: CreateSettingDto = {
          type: SettingType.PDF,
          key: 'Company Name',
          value: 'Muster GmbH',
        };

        const companyAddress: CreateSettingDto = {
          type: SettingType.PDF,
          key: 'Company Address',
          value: 'Musterweg 2, 12345 Musterstadt',
        };

        const companyTaxId: CreateSettingDto = {
          type: SettingType.PDF,
          key: 'Company Tax Id',
          value: '987654321',
        };

        const paymentName: CreateSettingDto = {
          type: SettingType.PDF,
          key: 'Payment Name',
          value: 'Hans Muster',
        };

        const paymentIban: CreateSettingDto = {
          type: SettingType.PDF,
          key: 'Payment Iban',
          value: 'DE89 3704 0044 0532 0130 00',
        };

        await this.settingService.createSetting(invoiceSubject, false);
        await this.settingService.createSetting(invoiceText, false);
        await this.settingService.createSetting(offerSubject, false);
        await this.settingService.createSetting(offerText, false);
        await this.settingService.createSetting(companyName, false);
        await this.settingService.createSetting(companyAddress, false);
        await this.settingService.createSetting(companyTaxId, false);
        await this.settingService.createSetting(paymentName, false);
        await this.settingService.createSetting(paymentIban, false);
      }
    }
  }

  private async devData() {
    //
  }
}
