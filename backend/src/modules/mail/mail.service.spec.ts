import { Test, TestingModule } from '@nestjs/testing';

describe('MailService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
    expect(module).toBeDefined();
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });
});
