import { execSync } from 'child_process';

export const appVersion = 'develop';
export const buildSha = execSync('git rev-parse HEAD')
  .toString()
  .trim()
  .slice(0, 7);
export const buildTime = new Date().toISOString();
