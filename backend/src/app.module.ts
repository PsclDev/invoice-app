import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@config';
import {
  ClientModule,
  DocumentModule,
  HealthController,
  MailModule,
  StatisticModule,
  SettingModule,
  SeederModule,
} from '@modules';

@Module({
  imports: [
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
        entities: [config.database.entitiesPath],
        synchronize: config.database.synchronize,
        migrationsRun: config.database.migrationsRun,
        migrations: [config.database.migrationsPath],
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
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
