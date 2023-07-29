import { ClientModule, DocumentModule } from '@modules';
import { Module } from '@nestjs/common';

import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';

@Module({
  imports: [ClientModule, DocumentModule],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
