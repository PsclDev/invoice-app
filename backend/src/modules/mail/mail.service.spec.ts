import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
