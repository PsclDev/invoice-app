import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, CompanyClient } from '@modules/client/client.entity';
import { Document, Offer, Invoice } from '@modules/document/document.entity';
import { Setting } from '@modules/setting/setting.entity';

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
