import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { Client, CompanyClient } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, CompanyClient])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
