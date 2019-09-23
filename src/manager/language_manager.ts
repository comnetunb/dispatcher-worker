import { EncapsulatePDU, GetLanguageCommand, LanguageSupport, LanguageCommand, ProtocolType, GetLanguageSupport, LanguageTestInfo, LanguageInfo } from 'dispatcher-protocol';
import { logger } from '../logger';
import * as Config from '../configuration';
import { execAsync } from '../resource';
import * as net from 'net';

const config = Config.getConfiguration();

export function init(socket: net.Socket): void {
  const packet: GetLanguageCommand = {
    type: ProtocolType.GetLanguageCommand,
    languages: [],
  };

  logger.debug('Requesting commands for all languages defined in the config file');
  socket.write(EncapsulatePDU(packet));
};

export async function testLanguages(pdu: LanguageCommand) {
  const { languages } = pdu;

  logger.debug('Executing tests for each language listed on config file');
  for (let i = 0; i < languages.length; i += 1) {
    const languageName = languages[i].name;
    config.languages.map[languageName] = await executeLanguageTest(languages[i]); // eslint-disable-line

    if (config.languages.map[languageName].supported) {
      logger.debug(`Test of language '${languageName}' succeeded`);
    } else {
      logger.error(`Test of language '${languageName}' failed`);
    }
  }
  logger.debug(`Tests done. Total number of languages tested: ${languages.length}`);
};

/**
 * Executes the command defined in language and check whether it succeeds.
 */
export async function executeLanguageTest(language: LanguageTestInfo): Promise<LanguageInfo> {
  const languageInfo: LanguageInfo = {
    name: language.name,
    command: language.command,
    supported: false,
    version: undefined
  };

  try {
    const { stdout, stderr } = await execAsync(languageInfo.command, { timeout: 5000 });
    languageInfo.supported = true;
    languageInfo.version = stderr.length > stdout.length ? stderr : stdout;
  } catch (err) {
    // empty
  }

  return languageInfo;
};

export async function getLanguageSupport(pdu: GetLanguageSupport, socket: net.Socket): Promise<void> {
  const packet: LanguageSupport = {
    type: ProtocolType.LanguageSupport,
    languageInfo: {
      name: pdu.name,
      command: pdu.command,
      supported: false,
      version: undefined,
    }
  };

  const { map } = config.languages;

  if (map[pdu.name] !== undefined) {
    packet.languageInfo = map[pdu.name];
  } else if (config.languages.allow_others) {
    try {
      const testedLanguage = await executeLanguageTest(pdu);
      map[pdu.name] = testedLanguage;
      packet.languageInfo = testedLanguage;
    } catch (err) {
      logger.error(err);
    }
  }
  socket.write(EncapsulatePDU(packet));
};

/**
 * Returns languages supported by the worker.
 * @return {Array} - Objects representing languages with the properties
 * 'name' and also possibly 'command' and 'version', if they are defined on runtime.
 */
export function getSupportedLanguages(): LanguageInfo[] {
  const { map } = config.languages;
  const supportedLanguages: LanguageInfo[] = [];
  for (let key in map) { // eslint-disable-line
    // check if the property/key is defined in the object itself, not in parent
    if (!map.hasOwnProperty(key)) continue; // eslint-disable-line

    supportedLanguages.push(map[key]);
  }
  return supportedLanguages;
};
