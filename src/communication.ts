import * as net from 'net';
import * as EventEmitter from 'events';
import { RemoveFirstPDU, ExposeFirstPDU } from 'dispatcher-protocol';
import * as dwpManager from './dwp_handler/manager';
import * as languageManager from './manager/language_manager';
import * as ddp from './ddp';
import { logger } from './logger';

export const event = new EventEmitter();

// Protocol Related
let socket = new net.Socket();

export function execute(): void {
  ddp.event.on('address', (address) => {
    let buffer = '';

    logger.debug(`Trying to connect to ${address}:16180`);

    socket = net.createConnection({ host: address, port: 16180 }, () => {
      logger.debug('TCP connection established');
      languageManager.init(socket);
    });

    socket.on('data', (data) => {
      buffer += data;

      let packet;
      try {
        do {
          // This may throw an exception
          packet = ExposeFirstPDU(buffer);

          // This may throw an exception
          buffer = RemoveFirstPDU(buffer);

          dwpManager.treat(packet, socket);
        } while (buffer.length !== 0);
      } catch (e) {
        // It is normal to end up here
        // Do not treat exception!
      }
    });

    socket.on('error', (err) => {
      socket.destroy();

      if (err.message) {
        logger.warn(err.message);
      }
    });

    socket.on('close', () => {
      logger.warn('Master connection closed!');
      ddp.resume();
    });

    socket.on('timeout', () => {
      logger.warn('Socket timed out! Closing connection');
      socket.destroy();
    });
  });
};
