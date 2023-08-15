import debugMod from 'debug';

export default function useLogger(namespace: string) {
  const logger_debug = debugMod(`app:${namespace}`);
  const logger_info = debugMod(`app:${namespace}`);
  const logger_warn = debugMod(`app:${namespace}`);
  const logger_error = debugMod(`app:${namespace}`);

  logger_debug.log = console.debug.bind(console);
  logger_info.log = console.info.bind(console);
  logger_warn.log = console.warn.bind(console);
  logger_error.log = console.error.bind(console);

  const trace = (...args: unknown[]): void => {
    logger_debug(args);
  };

  const debug = (...args: unknown[]): void => {
    logger_debug.apply(null, ['DEBUG', ...args]);
  };

  const info = (...args: unknown[]): void => {
    logger_info.apply(null, ['INFO', ...args]);
  };

  const log = (...args: unknown[]): void => {
    info(args);
  };

  const warn = (...args: unknown[]): void => {
    logger_warn.apply(null, ['WARN', ...args]);
  };

  const error = (...args: unknown[]): void => {
    logger_error.apply(null, ['ERROR', ...args]);
  };

  return { trace, debug, info, log, warn, error };
}
