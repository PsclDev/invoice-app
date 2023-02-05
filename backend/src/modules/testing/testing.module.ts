import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';

@Module({
  providers: [TestingService]
})
export class TestingModule {}
