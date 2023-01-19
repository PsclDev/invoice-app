// tslint:disable:no-console
import debug from "debug";

export class Logger {
  private loggers: {
    debug: debug.Debugger;
    info: debug.Debugger;
    warn: debug.Debugger;
    error: debug.Debugger;
  };

  constructor(namespace: string) {
    this.loggers = {
      debug: debug(`app:${namespace}`),
      info: debug(`app:${namespace}`),
      warn: debug(`app:${namespace}`),
      error: debug(`app:${namespace}`),
    };

    this.loggers.debug.log = console.debug.bind(console);
    this.loggers.info.log = console.info.bind(console);
    this.loggers.warn.log = console.warn.bind(console);
    this.loggers.error.log = console.error.bind(console);
  }

  trace(...args: unknown[]): void {
    this.debug(args);
  }

  debug(...args: unknown[]): void {
    this.loggers.debug.apply(null, ["DEBUG", ...args]);
  }

  info(...args: unknown[]): void {
    this.loggers.info.apply(null, ["INFO", ...args]);
  }

  log(...args: unknown[]): void {
    this.info(args);
  }

  warn(...args: unknown[]): void {
    this.loggers.warn.apply(null, ["WARN", ...args]);
  }

  error(...args: unknown[]): void {
    this.loggers.error.apply(null, ["ERROR", ...args]);
  }
}
