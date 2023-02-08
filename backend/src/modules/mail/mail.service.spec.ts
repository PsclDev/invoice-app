import { Client, Gender } from '@modules/client';
import { DocumentType, Invoice, Offer } from '@modules/document';
import {
  initSeeder,
  mailSeed,
  SqliteTestingImports,
  SqliteTestingProviders,
} from '@modules/testing';
import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheKeys, formatDocumentNumber, ProvideCacheKey } from '@utils';
import { SettingModule } from '..';
import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;
  let client: Client;
  let invoice: Invoice;
  let offer: Offer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...SqliteTestingImports(),
        SettingModule,
        MailerModule.forRoot({
          transport: {
            logger: false,
            host: '',
            secure: true,
            auth: {
              user: '',
              pass: '',
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: '',
          },
        }),
      ],
      providers: [
        ProvideCacheKey(CacheKeys.NONE),
        ...SqliteTestingProviders(),
        MailService,
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    await initSeeder();
    await mailSeed();

    client = {
      id: 'client1',
      gender: Gender.MALE,
      firstname: 'John',
      lastname: 'Doe',
      email: 'email@mail.de',
      street: 'Example Street 1',
      postalCode: '12345',
      city: 'Example City',
    };

    invoice = {
      client,
      id: 'invoice1',
      offerId: null,
      invoiceNr: 1,
      type: DocumentType.INVOICE,
      subTotal: 100,
      tax: 19,
      taxRate: 19,
      alreadyPaid: 10,
      total: 109,
      clientId: 'client1',
      dateOfIssue: new Date(),
      dueDate: new Date(),
      description: [],
      filepath: '',
    };

    offer = {
      client,
      id: 'offer1',
      invoice: null,
      invoiceId: null,
      offerNr: 1,
      type: DocumentType.OFFER,
      subTotal: 100,
      tax: 19,
      taxRate: 19,
      total: 119,
      clientId: 'client1',
      dateOfIssue: new Date(),
      description: [],
      filepath: '',
    };
  });

  it('should get invoice subject', async () => {
    const subject = await mailService.getSubject(client, invoice);
    expect(subject).toBe(
      `Your Invoice (I#${formatDocumentNumber(invoice.invoiceNr)})`,
    );
  });

  it('should get invoice text', async () => {
    const body = await mailService.getBody(client, invoice);
    expect(body).toBe(
      `Hello ${client.firstname} ${
        client.lastname
      }, your Invoice I#${formatDocumentNumber(
        invoice.invoiceNr,
      )} was created at ${invoice.dateOfIssue.toLocaleDateString(
        'de',
      )} and is due at ${invoice.dueDate.toLocaleDateString('de')}`,
    );
  });

  it('should get offer subject', async () => {
    const subject = await mailService.getSubject(client, offer);
    expect(subject).toBe(
      `Your Offer (O#${formatDocumentNumber(offer.offerNr)})`,
    );
  });

  it('should get offer text', async () => {
    const body = await mailService.getBody(client, offer);
    expect(body).toBe(
      `Hello ${client.firstname} ${
        client.lastname
      }, your Offer O#${formatDocumentNumber(
        offer.offerNr,
      )} was created at ${offer.dateOfIssue.toLocaleDateString('de')}`,
    );
  });
});
