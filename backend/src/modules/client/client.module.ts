import { CacheKeys, CustomCacheService } from '@helper';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    {
      provide: 'CACHE_KEY',
      useValue: CacheKeys.CLIENT,
    },
    CustomCacheService,
    ClientService,
  ],
  exports: [ClientService],
})
export class ClientModule {}
