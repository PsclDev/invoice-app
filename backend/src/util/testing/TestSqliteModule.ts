import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, CompanyClient } from '@modules/client';
import { Document, Offer, Invoice } from '@modules/document';
import { Setting } from '@modules/setting';

export const TestSqliteModule = () => [
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
