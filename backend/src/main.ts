import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@config/config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validateCustomDecorators: true,
    }),
  );

  app.setGlobalPrefix('v1', { exclude: ['', 'health'] });

  if (config.devMode) {
    const documentBuilder = new DocumentBuilder()
      .setTitle('Invoice-App')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.httpPort;
  await app.listen(port);
  logger.log(`listening on port: ${port}`);
}
bootstrap();
