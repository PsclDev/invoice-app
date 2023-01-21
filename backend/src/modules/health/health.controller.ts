import { ConfigService } from '@config';
import { capitalizeString } from '@helper';
import { Route } from '@modules/routes';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@ApiTags(capitalizeString(Route.HEALTH))
@Controller(Route.HEALTH)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
    private configSerivce: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const healthCheck = await this.health.check([
      () => this.http.pingCheck('api', 'http://127.0.0.1:3010/'),
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ]);

    return { version: this.configSerivce.appVersion, ...healthCheck };
  }
}
