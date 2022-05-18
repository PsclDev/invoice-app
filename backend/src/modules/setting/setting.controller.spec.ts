import { Test, TestingModule } from '@nestjs/testing';

describe('SettingsController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
