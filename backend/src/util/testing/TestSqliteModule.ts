import { TypeOrmModule } from '@nestjs/typeorm';
import { Document, Invoice, Offer } from '../../document/document.entity';
import { Client, CompanyClient } from '../../client/client.entity';

export const TestSqliteModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: ['src/**/*.entity.{ts,js}'],
    keepConnectionAlive: true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Document, Offer, Invoice, Client, CompanyClient]),
];
