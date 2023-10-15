import { ConfigModule } from '@config';
import { Client, CompanyClient } from '@modules/client';
import { CustomCacheService } from '@modules/common';
import { Document, Invoice, Offer, QueueItem } from '@modules/document';
import { Setting } from '@modules/setting';
import { CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export const SqliteTestingImports = () => [
  ConfigModule,
  CacheModule.register(),
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: ['src/**/*.entity.{ts,js}'],
    keepConnectionAlive: true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    Document,
    Offer,
    Invoice,
    Client,
    CompanyClient,
    QueueItem,
    Setting,
  ]),
];

export const SqliteTestingProviders = () => [CustomCacheService];
