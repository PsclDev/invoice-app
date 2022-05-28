import { generateId, updateEntity } from '@helper';
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
import { CreateSettingDto, SettingType, UpdateSettingDto } from './setting.dto';
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
        key: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ id });

    if (!setting) throw new NotFoundException();

    return setting;
  }

  async findByTypeAndKey(type: SettingType, key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ type, key });

    if (!setting) throw new NotFoundException();

    return setting;
  }

  async createSetting(
    settingDto: CreateSettingDto,
    deletable = true,
  ): Promise<Setting> {
    const existingSetting = await this.settingRepository.findOne({
      type: settingDto.type,
      key: settingDto.key,
    });
    if (existingSetting) {
      this.logger.warn(
        `Setting with the type "${settingDto.type}" and key "${settingDto.key}" already exists`,
      );
      throw new HttpException('Setting already exists', HttpStatus.CONFLICT);
    }

    const setting: Setting = {
      id: generateId<Setting>(this.settingRepository),
      type: settingDto.type,
      key: settingDto.key,
      value: settingDto.value,
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
