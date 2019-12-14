import * as net from 'net';
import * as EventEmitter from 'events';
import { RemoveFirstPDU, ExposeFirstPDU, PDU, ProtocolVersion, CommandData, PDUHeader } from 'dispatcher-protocol';
import * as dwpManager from './dwp_handler/manager';
import * as languageManager from './manager/language_manager';
import * as ddp from './ddp';
import { logger } from './logger';
import * as io from 'socket.io-client';
import { exists } from 'fs';

export const event = new EventEmitter();

// Protocol Related

let socket: SocketIOClient.Socket = null;

export function send(data: CommandData, callback?: (err: any) => any): void {
  if (socket == null) return;

  let header: PDUHeader = {
    ts: new Date(),
    v: ProtocolVersion,
  }

  let packet: PDU = {
    header,
    data,
  }

  socket.emit('data', packet, callback);
};


export function execute(): void {
  ddp.event.on('address', (address) => {
    logger.debug(`Trying to connect to ${address}:16180`);

    if (socket != null) {
      socket.removeAllListeners();
      socket.close();
      socket = null;
    }
    socket = io.connect(`http://${address}:16180`);

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

    socket.emit('authentication', { workerId: '5df46b27efa6f5157ab2d7fd', password: '123' });

    socket.on('data', (data: PDU) => {
      try {
        dwpManager.treat(data, socket);
      } catch (e) {
        logger.error(e);
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
