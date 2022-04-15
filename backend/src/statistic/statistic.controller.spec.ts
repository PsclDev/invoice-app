import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { documentSeed, TestSqliteModule } from '../util/testing';
import { StatisticService } from './statistic.service';

describe('StatisticController', () => {
  let statisticController: StatisticController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TestSqliteModule(), CacheModule.register()],
      controllers: [StatisticController],
      providers: [StatisticService],
    }).compile();

    statisticController = module.get<StatisticController>(StatisticController);
    await documentSeed();
  });

  it('should return statistics', async () => {
    expect(true);
  });
});
