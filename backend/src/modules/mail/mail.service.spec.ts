import { Test, TestingModule } from '@nestjs/testing';

describe('MailService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined;
  });
});
