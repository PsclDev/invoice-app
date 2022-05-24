import { Test, TestingModule } from '@nestjs/testing';

describe('StatisticController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined;
  });
});
