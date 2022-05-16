import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvExpand = require('dotenv-expand');
import * as Joi from 'joi';

dotenvExpand.expand(dotenv.config());

const CONFIG_SCHEMA = Joi.object().keys({
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
  frontendUrl: Joi.string().required(),
  pdfBackupExport: Joi.string().optional(),
  mail: Joi.object().keys({
    host: Joi.string().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    from: Joi.string().required(),
  }),
});

@Injectable()
export class ConfigService {
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
  frontendUrl = process.env.APP_FRONTEND_URL;
  pdfBackupExport = process.env.APP_PDF_BACKUP_EXPORT;
  mail = {
    host: process.env.APP_MAIL_HOST,
    user: process.env.APP_MAIL_USER,
    pass: process.env.APP_MAIL_PASS,
    from: process.env.APP_MAIL_FROM,
  };
}

Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid Configuration');
