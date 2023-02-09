import {
  initSeeder,
  mailSeed,
  exampleDataSet,
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
  let exampleData;

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

    exampleData = exampleDataSet();
  });

  it('should get invoice subject', async () => {
    const subject = await mailService.getSubject(
      exampleData.client,
      exampleData.invoice,
    );
    expect(subject).toBe(
      `Your Invoice (I#${formatDocumentNumber(exampleData.invoice.invoiceNr)})`,
    );
  });

  it('should get invoice text', async () => {
    const body = await mailService.getBody(
      exampleData.client,
      exampleData.invoice,
    );
    expect(body).toBe(
      `Hello ${exampleData.client.firstname} ${
        exampleData.client.lastname
      }, your Invoice I#${formatDocumentNumber(
        exampleData.invoice.invoiceNr,
      )} was created at ${exampleData.invoice.dateOfIssue.toLocaleDateString(
        'de',
      )} and is due at ${exampleData.invoice.dueDate.toLocaleDateString('de')}`,
    );
  });

  it('should get offer subject', async () => {
    const subject = await mailService.getSubject(
      exampleData.client,
      exampleData.offer,
    );
    expect(subject).toBe(
      `Your Offer (O#${formatDocumentNumber(exampleData.offer.offerNr)})`,
    );
  });

  it('should get offer text', async () => {
    const body = await mailService.getBody(
      exampleData.client,
      exampleData.offer,
    );
    expect(body).toBe(
      `Hello ${exampleData.client.firstname} ${
        exampleData.client.lastname
      }, your Offer O#${formatDocumentNumber(
        exampleData.offer.offerNr,
      )} was created at ${exampleData.offer.dateOfIssue.toLocaleDateString(
        'de',
      )}`,
    );
  });
});
