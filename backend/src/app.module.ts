import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocumentModule } from './document/document.module';
import { ClientModule } from './client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { StatisticModule } from './statistic/statistic.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from 'config/config.service';
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TerminusModule,
    ClientModule,
    DocumentModule,
    StatisticModule,
    MailModule,
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
      exclude: ['/v1*'],
    }),
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
