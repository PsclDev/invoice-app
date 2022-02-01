import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocumentModule } from './document/document.module';
import { ClientModule } from './client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    TerminusModule,
    TypeOrmModule.forRoot(),    
    ClientModule
  ],
  controllers: [AppController, HealthController],
})
export class AppModule { }
