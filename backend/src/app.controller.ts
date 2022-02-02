import { Controller, Get, Res, Response } from '@nestjs/common';
@Controller()
export class AppController {
  @Get()
  getPing(): string {
    return 'pong';
  }
}
