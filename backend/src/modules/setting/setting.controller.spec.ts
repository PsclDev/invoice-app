import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  deletableSettingId,
  nonDeletableSettingId,
  settingSeed,
  TestSqliteModule,
} from '@testing';
import { SettingController } from './setting.controller';
import { Setting } from './setting.entity';
import { PdfKey, SettingType } from '@helper';
import { SettingService } from './setting.service';

describe('SettingController', () => {
  let settingController: SettingController;
  let createdSettingId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TestSqliteModule()],
      controllers: [SettingController],
      providers: [SettingService],
    }).compile();

    settingController = module.get<SettingController>(SettingController);
    await settingSeed();
  });

  it('should create a pdf setting', async () => {
    const setting = await settingController.createSetting({
      type: SettingType.PDF,
      key: PdfKey.COMPANY_NAME,
      title: 'abc',
      value: 'efg',
      inputType: 'string',
    });

    createdSettingId = setting.id;
    expect(setting).toBeDefined();
  });

  it('should fail to create a mail setting', async () => {
    const create = async () => {
      await settingController.createSetting({
        type: SettingType.PDF,
        key: PdfKey.COMPANY_NAME,
        title: 'abc',
        value: 'efg',
        inputType: 'string',
      });
    };

    expect(create()).rejects.toThrow(HttpException);
    expect(create()).rejects.toThrow('Setting already exists');
  });

  it('should find a setting by id', async () => {
    const setting = await settingController.findById(createdSettingId);
    expect(setting).toBeDefined();
  });

  it('should update a setting', async () => {
    const value = 'xyz';
    await settingController.updateSetting(deletableSettingId, {
      value,
    });

    const setting = (await settingController.findById(
      deletableSettingId,
    )) as Setting;
    expect(setting).toBeDefined();
    expect(setting.value).toBe(value);
  });

  it('should delete a setting by id', async () => {
    const deleted = await settingController.deleteSetting(createdSettingId);
    expect(deleted).toBe(createdSettingId);
  });

  it('should fail to delete a setting because not found', async () => {
    const deleteClient = async () => {
      await settingController.deleteSetting('abcdefg');
    };

    expect(deleteClient()).rejects.toThrow(NotFoundException);
  });

  it('should fail to delete a setting because not deletable', async () => {
    const deleteClient = async () => {
      await settingController.deleteSetting(nonDeletableSettingId);
    };

    expect(deleteClient()).rejects.toThrow(ForbiddenException);
  });

  it('should find all settings', async () => {
    const clients = await settingController.findAll();
    expect(clients.length).toBe(2);
  });
});
