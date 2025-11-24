const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

export function createLogger(component) {
  const timestamp = () => new Date().toISOString();
  
  const log = (level, levelName, ...args) => {
    if (level >= currentLogLevel) {
      console.log(`[${timestamp()}] [${levelName}] [${component}]`, ...args);
    }
  };

  return {
    debug: (...args) => log(LOG_LEVELS.DEBUG, 'DEBUG', ...args),
    info: (...args) => log(LOG_LEVELS.INFO, 'INFO', ...args),
    warn: (...args) => log(LOG_LEVELS.WARN, 'WARN', ...args),
    error: (...args) => log(LOG_LEVELS.ERROR, 'ERROR', ...args)
  };
}
