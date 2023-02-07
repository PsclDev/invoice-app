import { SettingKeyType, SettingType } from './setting.types';
import { generateId, updateEntity } from '@utils';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingDto, UpdateSettingDto } from './setting.dto';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  private readonly logger = new Logger(SettingService.name);

  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.find({
      order: {
        type: 'ASC',
        key: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ id });

    if (!setting) throw new NotFoundException();

    return setting;
  }

  async findByTypeAndKey(
    type: SettingType,
    key: SettingKeyType,
  ): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ type, key });

    if (!setting) throw new NotFoundException();

    return setting;
  }

  async bulkInsert(
    settings: { setting: CreateSettingDto; deletable: boolean }[],
  ): Promise<void> {
    for (let idx = 0; idx < settings.length; idx++) {
      await this.createSetting(
        settings[idx].setting,
        settings[idx].deletable,
        true,
      );
    }
  }

  async createSetting(
    settingDto: CreateSettingDto,
    deletable = true,
    bulkInsert = false,
  ): Promise<Setting> {
    const existingSetting = await this.settingRepository.findOne({
      type: settingDto.type,
      key: settingDto.key,
    });
    if (existingSetting) {
      if (bulkInsert) return;

      this.logger.warn(
        `Setting with the type "${settingDto.type}" and key "${settingDto.key}" already exists`,
      );

      throw new HttpException('Setting already exists', HttpStatus.CONFLICT);
    }

    const setting: Setting = {
      id: generateId<Setting>(this.settingRepository),
      type: settingDto.type,
      key: settingDto.key,
      title: settingDto.title,
      value: settingDto.value,
      inputType: settingDto.inputType,
      inputMask: settingDto.inputMask,
      deletable,
    };

    return await this.settingRepository.save(setting);
  }

  async updateSetting(id: string, settingDto: UpdateSettingDto) {
    await updateEntity<Setting>(this.settingRepository, id, settingDto);
  }

  async delete(id: string): Promise<string> {
    const setting = await this.findById(id);
    if (!setting.deletable) throw new ForbiddenException();

    const result = await this.settingRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }
    return id;
  }
}
