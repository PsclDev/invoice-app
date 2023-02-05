import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, CompanyClient } from '@modules/client';
import { Document, Offer, Invoice } from '@modules/document';
import { Setting } from '@modules/setting';
import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@config';
import { CustomCacheService } from '@helper';

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
    Setting,
  ]),
];

export const SqliteTestingProviders = () => [CustomCacheService];
