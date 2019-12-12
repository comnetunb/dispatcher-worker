import * as dgram from 'dgram';
import * as EventEmitter from 'events';
import * as Config from './configuration';
import { logger } from './logger';

const configuration = Config.getConfiguration();
const socket = dgram.createSocket('udp4');
let receivedResponse = false;

export const event = new EventEmitter();

export function execute(): void {
  socket.on('listening', () => {
    socket.setBroadcast(true);

    if (configuration.dispatcherAddress !== undefined) {
      logger.debug(`Master address is configured: ${configuration.dispatcherAddress}`);
      return event.emit('address', configuration.dispatcherAddress);
    }

    logger.fatal('Configure dispatcher address please');
  });

  socket.on('message', (message, rinfo) => {
    // @TODO: Validate message

    if (!receivedResponse) {
      // Avoid duplicates
      logger.debug('Received response from master');
      event.emit('address', rinfo.address);
      receivedResponse = true;
    }
  });

  // Bind to any port
  socket.bind();
}

export function resume(): void {
  if (configuration.dispatcherAddress !== undefined) {
    event.emit('address', configuration.dispatcherAddress);
    return;
  }
}
