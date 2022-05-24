import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  clientSeed,
  companyClientId,
  privateClientId,
  TestSqliteModule,
} from '@testing';
import { ClientController } from './client.controller';
import { Gender } from './client.dto';
import { Client, CompanyClient } from './client.entity';
import { ClientService } from './client.service';

describe('ClientController', () => {
  let clientController: ClientController;
  let createdclientId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TestSqliteModule()],
      controllers: [ClientController],
      providers: [ClientService],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    await clientSeed();
  });

  it('should create a private client', async () => {
    const client = await clientController.createClient({
      firstname: 'John',
      lastname: 'Doe',
      gender: Gender.MALE,
      email: 'john@doe.com',
      street: 'Musterweg 1',
      postalCode: '98765',
      city: 'Musterhausen',
    });

    createdclientId = client.id;
    expect(client).toBeDefined();
  });

  it('should create a company client', async () => {
    const client = await clientController.createCompany({
      company: 'Doe Ltd.',
      vat: '123456789',
      firstname: 'Jane',
      lastname: 'Doe',
      gender: Gender.FEMALE,
      email: 'janex@doe.com',
      street: 'Musterweg 4',
      postalCode: '98765',
      city: 'Musterhausen',
    });

    expect(client).toBeDefined();
  });

  it('should fail to create a client', async () => {
    const create = async () => {
      await clientController.createClient({
        firstname: 'John',
        lastname: 'Doe',
        gender: Gender.MALE,
        email: 'john@doe.com',
        street: 'Musterweg 1',
        postalCode: '98765',
        city: 'Musterhausen',
      });
    };

    expect(create()).rejects.toThrow(HttpException);
    expect(create()).rejects.toThrow('Client already exists');
  });

  it('should fail to create a company client', async () => {
    const create = async () => {
      await clientController.createCompany({
        company: 'Doe Ltd.',
        vat: '123456789',
        firstname: 'Jane',
        lastname: 'Doe',
        gender: Gender.FEMALE,
        email: 'janex@doe.com',
        street: 'Musterweg 4',
        postalCode: '98765',
        city: 'Musterhausen',
      });
    };

    expect(create()).rejects.toThrow(HttpException);
    expect(create()).rejects.toThrow('Client already exists');
  });

  it('should find a client by id', async () => {
    const client = await clientController.findById(createdclientId);
    expect(client).toBeDefined();
  });

  it('should update a private client', async () => {
    const newStreet = 'Musterstr. 7';
    await clientController.updateClient(privateClientId, {
      street: newStreet,
    });

    const client = (await clientController.findById(privateClientId)) as Client;
    expect(client).toBeDefined();
    expect(client.street).toBe(newStreet);
  });

  it('should update a company client', async () => {
    const newVat = '987654321';
    await clientController.updateCompany(companyClientId, {
      vat: newVat,
    });

    const client = (await clientController.findById(
      companyClientId,
    )) as CompanyClient;
    expect(client).toBeDefined();
    expect(client.vat).toBe(newVat);
  });

  it('should delete a client by id', async () => {
    const deleted = await clientController.deleteClient(createdclientId);
    expect(deleted).toBe(createdclientId);
  });

  it('should fail to delete a client', async () => {
    const deleteClient = async () => {
      await clientController.deleteClient('abcdefg');
    };

    expect(deleteClient()).rejects.toThrow(NotFoundException);
  });

  it('should find all clients', async () => {
    const clients = await clientController.findAll();
    expect(clients.length).toBe(3);
  });
});
