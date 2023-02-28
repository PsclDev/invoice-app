import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvExpand = require('dotenv-expand');
import * as Joi from 'joi';

dotenvExpand.expand(dotenv.config());

const CONFIG_SCHEMA = Joi.object().keys({
  appVersion: Joi.string().required(),
  cacheTTL: Joi.number().integer().required(),
  chromiumNoSandboxMode: Joi.bool().optional(),
  chromiumPath: Joi.string().optional(),
  database: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().integer().greater(0).required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required(),
    entitiesPath: Joi.string().optional(),
    synchronize: Joi.bool().optional(),
    migrationsRun: Joi.bool().optional(),
    migrationsPath: Joi.string().optional(),
  }),
  devMode: Joi.bool().required(),
  disableSeeding: Joi.bool().optional(),
  frontendUrl: Joi.string().required(),
  httpPort: Joi.number().integer().greater(0).required(),
  ignoreHTTPSErrors: Joi.bool().optional(),
  mail: Joi.object().keys({
    logging: Joi.bool().optional(),
    host: Joi.string().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    from: Joi.string().required(),
  }),
  nodeEnv: Joi.string().required(),
  pdfBackupExport: Joi.string().optional(),
  printConfiguration: Joi.bool().optional(),
});

@Injectable()
export class ConfigService {
  nodeEnv = process.env.NODE_ENV || 'prod';
  appVersion = process.env.npm_package_version || 'unkown';
  cacheTTL = Number(process.env.APP_CACHE_TTL) || 30;
  chromiumPath = process.env.APP_CHROMIUM_PATH;
  chromiumNoSandboxMode =
    bool(process.env.APP_CHROMIUM_NO_SANDBOX_MODE) || false;
  database = {
    host: process.env.APP_DB_HOST,
    port: Number(process.env.APP_DB_PORT) || 5432,
    user: process.env.APP_DB_USER,
    pass: process.env.APP_DB_PASS,
    name: process.env.APP_DB_NAME,
    entitiesPath: process.env.APP_MIGRATIONS_PATH || 'dist/**/*.entity.js',
    synchronize: bool(process.env.APP_DB_SYNCHRONIZE) || false,
    migrationsRun: bool(process.env.APP_RUN_MIGRATIONS) || true,
    migrationsPath: process.env.APP_MIGRATIONS_PATH || 'dist/migrations/*.js',
  };
  devMode = this.nodeEnv === 'dev' || this.nodeEnv === 'development';
  disableSeeding = bool(process.env.APP_DISABLE_SEEDING) || false;
  frontendUrl = process.env.APP_FRONTEND_URL;
  httpPort = Number(process.env.APP_PORT) || 3010;
  ignoreHTTPSErrors = bool(process.env.APP_IGNORE_HTTPS_ERRORS) || false;
  mail = {
    logging: bool(process.env.APP_MAIL_LOGGING) || false,
    host: process.env.APP_MAIL_HOST,
    user: process.env.APP_MAIL_USER,
    pass: process.env.APP_MAIL_PASS,
    from: process.env.APP_MAIL_FROM,
  };
  printConfiguration = bool(process.env.APP_PRINT_CONFIGURATION) || false;
  pdfBackupExport = process.env.APP_PDF_BACKUP_EXPORT;
}

function bool(input: string): boolean {
  if (!input) return null;
  return input.toLowerCase() === 'true';
}

if (!Boolean(process.env.APP_IS_RUNNING_IN_PIPELINE)) {
  Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid Configuration');
}
