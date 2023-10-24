import { CustomCacheService } from '@modules/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateId, updateEntity } from '@utils';
import { Repository } from 'typeorm';

import {
  CreateClientDto,
  CreateCompanyClientDto,
  UpdateClientDto,
  UpdateCompanyClientDto,
} from './client.dto';
import { Client, CompanyClient } from './client.entity';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    private readonly customCacheService: CustomCacheService<Client>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(CompanyClient)
    private companyClientRepository: Repository<CompanyClient>,
  ) {}

  async findAll(): Promise<Client[]> {
    const expectedItems = await this.clientRepository.count();
    const cachedClients = await this.customCacheService.getCachedData();
    if (cachedClients && expectedItems === cachedClients.length) {
      this.logger.log('Getting clients from cache');
      return cachedClients;
    }

    const clients = await this.clientRepository.find({
      order: {
        lastname: 'ASC',
      },
    });
    await this.customCacheService.setDataToCache(clients);

    return clients;
  }

  async findById(id: string): Promise<Client> {
    const cachedClient =
      await this.customCacheService.getItemFromCachedData(id);
    if (cachedClient) {
      this.logger.log(`Getting client '${id}' from cache`);
      return cachedClient;
    }

    const client = await this.clientRepository.findOne({ id });

    if (!client) throw new NotFoundException();

    return client;
  }

  async bulkInsert(clients: CreateClientDto[]): Promise<void> {
    for (let idx = 0; idx < clients.length; idx++) {
      await this.createClient(clients[idx]);
    }
  }

  async createClient(
    clientDto: CreateClientDto,
    bulkInsert = false,
  ): Promise<Client> {
    const existingClient = await this.clientRepository.findOne({
      firstname: clientDto.firstname,
      lastname: clientDto.lastname,
    });
    if (existingClient) {
      if (bulkInsert) return;

      this.logger.warn(
        `Client with the name: ${clientDto.firstname} ${clientDto.lastname} already exists`,
      );
      throw new HttpException('Client already exists', HttpStatus.CONFLICT);
    }

    const client: Client = {
      id: generateId<Client>(this.clientRepository),
      gender: clientDto.gender,
      firstname: clientDto.firstname,
      lastname: clientDto.lastname,
      email: clientDto.email,
      street: clientDto.street,
      postalCode: clientDto.postalCode,
      city: clientDto.city,
    };

    const newClient = await this.clientRepository.save(client);
    await this.customCacheService.addNewDataToCache(newClient);

    return newClient;
  }

  async updateClient(id: string, clientDto: UpdateClientDto) {
    await updateEntity<Client>(this.clientRepository, id, clientDto);

    const client = await this.findById(id);
    await this.customCacheService.updateExistingDataInCache(id, client);
  }

  async bulkInsertCompanies(
    companies: CreateCompanyClientDto[],
  ): Promise<void> {
    for (let idx = 0; idx < companies.length; idx++) {
      await this.createCompanyClient(companies[idx]);
    }
  }

  async createCompanyClient(
    clientDto: CreateCompanyClientDto,
    bulkInsert = false,
  ): Promise<CompanyClient> {
    const existingClient = await this.companyClientRepository.findOne({
      company: clientDto.company,
    });
    if (existingClient) {
      if (bulkInsert) return;

      this.logger.warn(
        `Client with the name: ${clientDto.firstname} ${clientDto.lastname} already exists`,
      );
      throw new HttpException('Client already exists', HttpStatus.CONFLICT);
    }

    const client: CompanyClient = {
      id: generateId<Client>(this.clientRepository),
      company: clientDto.company,
      vat: clientDto.vat,
      gender: clientDto.gender,
      firstname: clientDto.firstname,
      lastname: clientDto.lastname,
      email: clientDto.email,
      street: clientDto.street,
      postalCode: clientDto.postalCode,
      city: clientDto.city,
    };

    const newClient = await this.companyClientRepository.save(client);
    await this.customCacheService.addNewDataToCache(newClient);

    return newClient;
  }

  async updateCompanyClient(id: string, clientDto: UpdateCompanyClientDto) {
    await updateEntity<CompanyClient>(
      this.companyClientRepository,
      id,
      clientDto,
    );

    const client = await this.findById(id);
    await this.customCacheService.updateExistingDataInCache(id, client);
  }

  async delete(id: string): Promise<string> {
    const result = await this.clientRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }

    await this.customCacheService.deleteDataFromCache(id);

    return id;
  }
}
