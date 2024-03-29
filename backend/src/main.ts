import { ConfigService } from '@config';
import { Route } from '@modules/routes';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  if (config.printConfiguration)
    logger.log(`App Configuration: ${JSON.stringify(config, undefined, 2)}`);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validateCustomDecorators: true,
    }),
  );

  app.setGlobalPrefix('v1', { exclude: ['', Route.HEALTH] });

  if (config.devMode) {
    const documentBuilder = new DocumentBuilder()
      .setTitle('Invoice-App')
      .setVersion(config.app.version)
      .build();
    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.httpPort;
  await app.listen(port);
  logger.log(
    `App listening on port: ${port} | version: ${config.app.version}, build: ${config.app.buildSha}, time: ${config.app.buildTime}`,
  );
}
bootstrap();
