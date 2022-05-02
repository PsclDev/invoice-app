import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocumentModule } from './document/document.module';
import { ClientModule } from './client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StatisticModule } from './statistic/statistic.module';
import { MailModule } from './mail/mail.module';
import configuration from 'config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    HttpModule,
    TerminusModule,
    TypeOrmModule.forRoot(),
    ClientModule,
    DocumentModule,
    StatisticModule,
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      exclude: ['/v1*'],
    }),
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
