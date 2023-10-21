/* eslint-disable no-console */
import debugMod from 'debug';

export default function useLogger(namespace: string) {
  const loggerDebug = debugMod(`app:${namespace}`);
  const loggerInfo = debugMod(`app:${namespace}`);
  const loggerWarn = debugMod(`app:${namespace}`);
  const loggerError = debugMod(`app:${namespace}`);

  loggerDebug.log = console.debug.bind(console);
  loggerInfo.log = console.info.bind(console);
  loggerWarn.log = console.warn.bind(console);
  loggerError.log = console.error.bind(console);

  const trace = (...args: unknown[]): void => {
    loggerDebug(args);
  };

  const debug = (...args: unknown[]): void => {
    loggerDebug('DEBUG', ...args);
  };

  const info = (...args: unknown[]): void => {
    loggerInfo('INFO', ...args);
  };

  const log = (...args: unknown[]): void => {
    info(args);
  };

  const warn = (...args: unknown[]): void => {
    loggerWarn('WARN', ...args);
  };

  const error = (...args: unknown[]): void => {
    loggerError('ERROR', ...args);
  };

  return { trace, debug, info, log, warn, error };
}
