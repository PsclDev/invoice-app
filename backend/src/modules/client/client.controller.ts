import { capitalizeString } from '@helper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Route } from '@modules/routes';
import {
  CreateClientDto,
  CreateCompanyClientDto,
  UpdateClientDto,
  UpdateCompanyClientDto,
} from './client.dto';
import { Client, CompanyClient } from './client.entity';
import { ClientService } from './client.service';

@ApiTags(capitalizeString(Route.CLIENT))
@Controller(Route.CLIENT)
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    this.logger.log('Get all clients');
    return this.clientService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Client> {
    this.logger.log(`Get client by id: ${id}`);
    return this.clientService.findById(id);
  }

  @Post()
  async createClient(@Body() body: CreateClientDto): Promise<Client> {
    this.logger.log('Post Client', body);
    return await this.clientService.createClient(body);
  }

  @Patch(':id')
  async updateClient(@Param('id') id: string, @Body() body: UpdateClientDto) {
    this.logger.log(`Patch Client with id: ${id}`, body);
    return await this.clientService.updateClient(id, body);
  }

  @Post('/company')
  async createCompany(
    @Body() body: CreateCompanyClientDto,
  ): Promise<CompanyClient> {
    this.logger.log('Post Company Client', body);
    return await this.clientService.createCompanyClient(body);
  }

  @Patch('/company/:id')
  async updateCompany(
    @Param('id') id: string,
    @Body() body: UpdateCompanyClientDto,
  ) {
    this.logger.log(`Patch Company Client with id: ${id}`, body);
    return await this.clientService.updateCompanyClient(id, body);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    this.logger.log(`Delete client with id: ${id}`);
    return await this.clientService.delete(id);
  }
}
