import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ping')
@Controller()
export class AppController {
  @Get()
  getPing(): string {
    return 'pong';
  }
}
