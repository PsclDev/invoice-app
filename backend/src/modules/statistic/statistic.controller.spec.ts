import {
  clientSeed,
  documentSeed,
  initSeeder,
  SqliteTestingImports,
  SqliteTestingProviders,
} from '@modules/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheKeys, ProvideCacheKey } from '@utils';

import { StatisticController } from './statistic.controller';
import { StatisticsDto } from './statistic.dto';
import { StatisticService } from './statistic.service';

describe('StatisticController', () => {
  let statisticController: StatisticController;
  let stats: StatisticsDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...SqliteTestingImports()],
      controllers: [StatisticController],
      providers: [
        ProvideCacheKey(CacheKeys.STATISTIC),
        ...SqliteTestingProviders(),
        StatisticService,
      ],
    }).compile();

    statisticController = module.get<StatisticController>(StatisticController);
    await initSeeder();
    await clientSeed();
    await documentSeed();

    stats = await statisticController.getStats();
  });

  it('should get client stats', async () => {
    expect(stats.clients).toStrictEqual({ all: 2, privates: 1, companies: 1 });
  });

  it('should get all time documents stats', async () => {
    expect(stats.documents.allTime).toStrictEqual({
      all: 2,
      invoices: 1,
      offers: 1,
      revenues: 1000,
      taxes: 190,
      totalRevenues: 1190,
    });
  });

  it('should get yearly documents stats', async () => {
    //TODO
    expect(true).toBeTruthy();
  });
});
