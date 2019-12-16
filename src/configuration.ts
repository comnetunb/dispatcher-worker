import * as fs from 'fs';
import * as helpers from './helpers';
import { logger } from './logger';
import { LanguageInfo } from 'dispatcher-protocol';

export interface Configuration {
  workerId: string,
  workerPassword: string,
  dispatcherAddress: string,
  dispatcherPort: number,
}

let configuration: Configuration;

load();

export function getConfiguration(): Configuration {
  if (Object.keys(configuration).length === 0 && configuration.constructor === Object) {
    load();
  }

  return configuration;
};

function load(): void {
  let path: string;
  if (process.env.NODE_ENV == 'production') {
    path = `${__dirname}/../config/config.json`;
  } else {
    path = `${__dirname}/../config/config.sample.json`;
  }

  try {
    configuration = JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));

    if (configuration.dispatcherAddress === undefined) {
      logger.warn('Dispatcher address is not configured, falling back to localhost');
      configuration.dispatcherAddress = '127.0.0.1';
    }
    if (configuration.dispatcherPort === undefined) {
      logger.warn('Dispatcher port is not configured, falling back to default 16180');
      configuration.dispatcherPort = 16180;
    }

    if (configuration.workerId === undefined) {
      logger.fatal('Id of the worker is not configured, cannot proceed');
      throw new Error('Missing worker id');
    }

    if (configuration.workerPassword === undefined) {
      logger.fatal('Password of the worker is not configured, cannot proceed');
      throw new Error('Missing worker password');
    }
  } catch (err) {
    logger.error(`Error while loading configuration files: ${err}`);
    throw err;
  }
}
