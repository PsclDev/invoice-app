import { capitalizeString } from '@utils';
import { Route } from '@modules/routes';
import {
  Controller,
  Logger,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSettingDto, UpdateSettingDto } from './setting.dto';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';

@ApiTags(capitalizeString(Route.SETTING))
@Controller(Route.SETTING)
export class SettingController {
  private readonly logger = new Logger(SettingController.name);

  constructor(private readonly settingService: SettingService) {}

  @Get()
  async findAll(): Promise<Setting[]> {
    this.logger.log('Get all settings');
    return this.settingService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Setting> {
    this.logger.log(`Get setting by id: ${id}`);
    return this.settingService.findById(id);
  }

  @Post()
  async createSetting(@Body() body: CreateSettingDto): Promise<Setting> {
    this.logger.log('Post setting', body);
    return await this.settingService.createSetting(body);
  }

  @Patch(':id')
  async updateSetting(@Param('id') id: string, @Body() body: UpdateSettingDto) {
    this.logger.log(`Patch setting with id: ${id}`, body);
    return await this.settingService.updateSetting(id, body);
  }

  @Delete(':id')
  async deleteSetting(@Param('id') id: string) {
    this.logger.log(`Delete setting with id: ${id}`);
    return await this.settingService.delete(id);
  }
}
