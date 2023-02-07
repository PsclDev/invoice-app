import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { Client, CompanyClient } from '../client/client.entity';
import { Offer, Invoice } from '../document/document.entity';
import { CustomCacheService } from '@modules/common';
import { CacheKeys, ProvideCacheKey } from '@utils';

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
