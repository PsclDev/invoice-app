import { Route } from '@modules/routes';
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { capitalizeString } from '@utils';

import { StatisticsDto } from './statistic.dto';
import { StatisticService } from './statistic.service';

@ApiTags(capitalizeString(Route.STATISTICS))
@Controller(Route.STATISTICS)
export class StatisticController {
  private readonly logger = new Logger(StatisticController.name);

  constructor(private readonly statsService: StatisticService) {}

  @Get()
  async getStats(): Promise<StatisticsDto> {
    this.logger.log('Get all statistics');
    return await this.statsService.getStats();
  }
}
