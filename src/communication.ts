import * as net from 'net';
import * as EventEmitter from 'events';
import { RemoveFirstPDU, ExposeFirstPDU } from 'dispatcher-protocol';
import * as dwpManager from './dwp_handler/manager';
import * as languageManager from './manager/language_manager';
import * as ddp from './ddp';
import { logger } from './logger';
import * as io from 'socket.io-client';
import { exists } from 'fs';

export const event = new EventEmitter();

// Protocol Related

export function execute(): void {
  ddp.event.on('address', (address) => {
    let buffer = '';
    logger.debug(`Trying to connect to ${address}:16180`);

    let socket = io.connect(`http://${address}:16180`);

    socket.on('connect', () => {
      logger.debug('TCP connection established');
    });

    socket.on('disconnect', () => {
      logger.warn('Master connection closed!');
      ddp.resume();
    });

    socket.on('unauthorized', () => {
      logger.fatal(`Worker unauthorized, check your credentials`);
      throw 'Unauthorized';
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
      socket.close();
      logger.fatal(err);
    });

    socket.on('timeout', () => {
      logger.warn('Socket timed out! Closing connection');
      socket.close();
    });
  });
};
