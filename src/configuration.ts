import * as fs from 'fs';
import * as helpers from './helpers';
import { logger } from './logger';
import { LanguageInfo } from 'dispatcher-protocol';

export interface Configuration {
  dispatcherAddress?: string,
  languages?: {
    allow_others?: boolean,
    map?: {
      [propName: string]: LanguageInfo,
    },
  },
  alias?: string,
}

let configuration: Configuration = {};

load();

export function getConfiguration(): Configuration {
  if (Object.keys(configuration).length === 0 && configuration.constructor === Object) {
    load();
  }

  return configuration;
};

function load(): void {
  try {
    configuration = JSON.parse(fs.readFileSync(`${__dirname}/../config/config.json`, 'utf8').replace(/^\uFEFF/, ''));
  } catch (err) {
    logger.error('Error while loading configuration files, treating everything as default');
  }

  treatDefaultValues();
}

function treatDefaultValues(): void {
  if (configuration.dispatcherAddress && !helpers.validateIp(configuration.dispatcherAddress)) {
    logger.debug('Master\'s defined IP is invalid. Removing configuration...');
    configuration.dispatcherAddress = undefined;
  }
}
