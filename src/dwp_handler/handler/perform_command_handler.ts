
import * as stateManager from '../../manager/state_manager';
import { PerformCommand } from 'dispatcher-protocol';
import * as net from 'net';

export function execute(pdu: PerformCommand, socket: SocketIOClient.Socket): void { // eslint-disable-line no-unused-vars
  stateManager.handleCommand(pdu.command);
};
