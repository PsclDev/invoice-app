import { generateId, updateEntity } from '@helper';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(CompanyClient)
    private companyClientRepository: Repository<CompanyClient>,
  ) {}

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async findById(id: string): Promise<Client> {
    return await this.clientRepository.findOne({ id });
  }

  async createClient(clientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findOne({
      firstname: clientDto.firstname,
      lastname: clientDto.lastname,
    });
    if (existingClient) {
      this.logger.warn(
        `Client with the name: ${clientDto.firstname} ${clientDto.lastname} already exists`,
      );
      throw new HttpException('Invoice already exists', HttpStatus.CONFLICT);
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

    return await this.clientRepository.save(client);
  }

  async updateClient(id: string, clientDto: UpdateClientDto) {
    await updateEntity<Client>(this.clientRepository, id, clientDto);
  }

  async createCompanyClient(
    clientDto: CreateCompanyClientDto,
  ): Promise<CompanyClient> {
    const existingClient = await this.companyClientRepository.findOne({
      company: clientDto.company,
    });
    if (existingClient) {
      this.logger.warn(
        `Client with the name: ${clientDto.firstname} ${clientDto.lastname} already exists`,
      );
      throw new HttpException('Invoice already exists', HttpStatus.CONFLICT);
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

    return await this.companyClientRepository.save(client);
  }

  async updateCompanyClient(id: string, clientDto: UpdateCompanyClientDto) {
    await updateEntity<CompanyClient>(
      this.companyClientRepository,
      id,
      clientDto,
    );
  }

  async delete(id: string) {
    const result = await this.clientRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }
  }
}
