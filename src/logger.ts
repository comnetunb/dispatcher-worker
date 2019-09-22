import { configure, getLogger } from 'log4js';

configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'log/app.log' }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
});

export const logger = getLogger();
