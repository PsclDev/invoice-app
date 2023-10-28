import { ConfigModule, ConfigService } from '@config';
import { Client, CompanyClient } from '@modules/client';
import { CustomCacheService } from '@modules/common';
import { Document, Invoice, Offer, QueueItem } from '@modules/document';
import { Setting } from '@modules/setting';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';

export const PostgresTestingImports = () => [
  ConfigModule,
  CacheModule.register(),
  TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.pass,
      database: config.database.name,
      entities: ['**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/*.ts'],
    }),
    inject: [ConfigService],
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

export const PostgresTestingProviders = () => [CustomCacheService];
