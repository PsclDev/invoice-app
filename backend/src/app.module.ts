import { ConfigModule, ConfigService } from '@config';
import {
  AiModule,
  ClientModule,
  DocumentModule,
  HealthController,
  MailModule,
  SeederModule,
  SettingModule,
  StatisticModule,
  TestingModule,
} from '@modules';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';

@Module({
  imports: [
    AiModule,
    ClientModule,
    ConfigModule,
    DocumentModule,
    HttpModule,
    MailModule,
    StatisticModule,
    SettingModule,
    TerminusModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.pass,
        database: config.database.name,
        entities: ['dist/src/**/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files',
      exclude: ['/v1*'],
    }),
    SeederModule,
    TestingModule,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
