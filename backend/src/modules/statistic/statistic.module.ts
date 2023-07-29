import { CustomCacheService } from '@modules/common';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheKeys, ProvideCacheKey } from '@utils';

import { Client, CompanyClient } from '../client/client.entity';
import { Invoice, Offer } from '../document/document.entity';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Client, CompanyClient, Offer, Invoice]),
  ],
  controllers: [StatisticController],
  providers: [
    ProvideCacheKey(CacheKeys.STATISTIC),
    CustomCacheService,
    StatisticService,
  ],
})
export class StatisticModule {}
