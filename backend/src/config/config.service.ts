import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvExpand = require('dotenv-expand');
import * as Joi from 'joi';

import { appVersion, buildSha, buildTime } from '../../app-version';

dotenvExpand.expand(dotenv.config());

const CONFIG_SCHEMA = Joi.object().keys({
  app: Joi.object().keys({
    version: Joi.string().required(),
    buildSha: Joi.string().required(),
    buildTime: Joi.string().required(),
  }),
  cacheTTL: Joi.number().integer().required(),
  chromiumNoSandboxMode: Joi.bool().optional(),
  chromiumPath: Joi.string().optional(),
  database: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().integer().greater(0).required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required(),
  }),
  devMode: Joi.bool().required(),
  disableSeeding: Joi.bool().optional(),
  frontendUrl: Joi.string().required(),
  gpt: Joi.object().keys({
    enabled: Joi.bool().required(),
    apiKey: Joi.when('enabled', {
      is: true,
      then: Joi.string().required(),
    }),
    organizationId: Joi.when('enabled', {
      is: true,
      then: Joi.string(),
    }),
    temperature: Joi.when('enabled', {
      is: true,
      then: Joi.number().precision(1).greater(0).less(1).required(),
    }),
  }),
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
  nodeEnv = process.env.NODE_ENV || 'production';
  app = {
    version: appVersion,
    buildSha,
    buildTime,
  };
  cacheTTL = (Number(process.env.APP_CACHE_TTL) || 30) * 60 * 1000;
  chromiumPath = process.env.APP_CHROMIUM_PATH;
  chromiumNoSandboxMode =
    bool(process.env.APP_CHROMIUM_NO_SANDBOX_MODE) || false;
  database = switchEnv(
    {
      testing: {
        host: process.env.APP_TEST_DB_HOST,
        port: Number(process.env.APP_TEST_DB_PORT) || 5432,
        user: process.env.APP_TEST_DB_USER,
        pass: process.env.APP_TEST_DB_PASS,
        name: process.env.APP_TEST_DB_NAME,
      },
    },
    {
      host: process.env.APP_DB_HOST,
      port: Number(process.env.APP_DB_PORT) || 5432,
      user: process.env.APP_DB_USER,
      pass: process.env.APP_DB_PASS,
      name: process.env.APP_DB_NAME,
    },
  );
  devMode = this.nodeEnv === 'dev' || this.nodeEnv === 'development';
  disableSeeding = bool(process.env.APP_DISABLE_SEEDING) || false;
  frontendUrl = process.env.APP_FRONTEND_URL;
  gpt = {
    enabled: bool(process.env.APP_GPT_ENABLED) || false,
    apiKey: process.env.APP_GPT_API_KEY,
    organizationId: process.env.APP_GPT_ORG_ID,
    temperature: Number(process.env.APP_GPT_TEMPEARATURE) || 0.3,
  };
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
  return input.toLowerCase() === 'true' || input === '1';
}

if (!Boolean(process.env.APP_IS_RUNNING_IN_PIPELINE)) {
  Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid Configuration');
}

function switchEnv<T>(cases: { [key: string]: T }, defaultVal: T): T {
  const env = process.env.NODE_ENV || 'production';
  if (Object.prototype.hasOwnProperty.call(cases, env)) {
    return cases[env];
  }

  return defaultVal;
}
