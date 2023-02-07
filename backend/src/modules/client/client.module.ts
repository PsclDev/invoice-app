import { CacheKeys } from '@utils';
import { CustomCacheService } from '@modules/common';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvideCacheKey } from '@utils';
import { ClientController } from './client.controller';
import { Client, CompanyClient } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Client, CompanyClient]),
  ],
  controllers: [ClientController],
  providers: [
    ProvideCacheKey(CacheKeys.CLIENT),
    CustomCacheService,
    ClientService,
  ],
  exports: [ClientService],
})
export class ClientModule {}
