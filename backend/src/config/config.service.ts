import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvExpand = require('dotenv-expand');
import * as Joi from 'joi';

dotenvExpand.expand(dotenv.config());

const CONFIG_SCHEMA = Joi.object().keys({
  nodeEnv: Joi.string().required(),
  devMode: Joi.bool().required(),
  httpPort: Joi.number().integer().greater(0).required(),
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
  disableSeeding: Joi.bool().optional(),
  frontendUrl: Joi.string().required(),
  pdfBackupExport: Joi.string().optional(),
  mail: Joi.object().keys({
    logging: Joi.bool().optional(),
    host: Joi.string().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    from: Joi.string().required(),
  }),
});

@Injectable()
export class ConfigService {
  nodeEnv = process.env.NODE_ENV || 'prod';
  devMode = this.nodeEnv === 'dev' || this.nodeEnv === 'development';
  httpPort = Number(process.env.APP_PORT) || 3010;
  database = {
    host: process.env.APP_DB_HOST,
    port: Number(process.env.APP_DB_PORT) || 5432,
    user: process.env.APP_DB_USER,
    pass: process.env.APP_DB_PASS,
    name: process.env.APP_DB_NAME,
    entitiesPath: process.env.APP_MIGRATIONS_PATH || 'dist/**/*.entity.js',
    synchronize: Boolean(process.env.APP_DB_SYNCHRONIZE) || false,
    migrationsRun: Boolean(process.env.APP_RUN_MIGRATIONS) || true,
    migrationsPath: process.env.APP_MIGRATIONS_PATH || 'dist/migrations/*.js',
  };
  disableSeeding = process.env.APP_DISABLE_SEEDING || false;
  frontendUrl = process.env.APP_FRONTEND_URL;
  pdfBackupExport = process.env.APP_PDF_BACKUP_EXPORT;
  mail = {
    logging: Boolean(process.env.APP_MAIL_LOGGING) || false,
    host: process.env.APP_MAIL_HOST,
    user: process.env.APP_MAIL_USER,
    pass: process.env.APP_MAIL_PASS,
    from: process.env.APP_MAIL_FROM,
  };
}

if (!Boolean(process.env.APP_IS_RUNNING_IN_PIPELINE)) {
  Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid Configuration');
}
