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

    return resume();
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
  logger.debug('Trying to discover master via UDP broadcast');

  send();

  let tries = 0;

  const intervalId = setInterval(() => {
    if (receivedResponse) {
      receivedResponse = false;
      clearInterval(intervalId);
      return undefined;
    }

    if (tries >= 10 && (configuration.dispatcherAddress !== undefined)) {
      logger.debug(`${tries} tries to connect to master via UDP broadcast. Trying again with address configured`);
      tries = 0;
      clearInterval(intervalId);
      return event.emit('dispatcher_address', configuration.dispatcherAddress);
    }

    tries += 1;
    return send();
  }, 1000);
}

function send(): void {
  const message = 'NewWorker';

  // Send message and wait for master's response
  socket.send(message, 0, message.length, 16180, '255.255.255.255');
}
