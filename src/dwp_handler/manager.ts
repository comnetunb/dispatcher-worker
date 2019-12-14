// General Requirements
import * as net from 'net';
import { CommandData, PDU, ProtocolType, GetReport, LanguageCommand, GetLanguageSupport, PerformCommand, TerminateTask, PerformTask } from 'dispatcher-protocol';
import { logger } from '../logger';

// DWP Handler Related
import * as getReportHandler from './handler/get_report_handler';
import * as performTaskHandler from './handler/perform_task_handler';
import * as terminateTaskHandler from './handler/terminate_task_handler';
import * as performCommandHandler from './handler/perform_command_handler';
import * as languageManager from '../manager/language_manager';

export function treat(pdu: PDU, socket: SocketIOClient.Socket): void {
  switch (pdu.data.type) {
    case ProtocolType.GetReport:
      getReportHandler.execute(pdu.data as GetReport, socket);
      break;

    case ProtocolType.PerformTask:
      performTaskHandler.execute(pdu.data as PerformTask, socket);
      break;

    case ProtocolType.TerminateTask:
      terminateTaskHandler.execute(pdu.data as TerminateTask, socket);
      break;

    case ProtocolType.PerformCommand:
      performCommandHandler.execute(pdu.data as PerformCommand, socket);
      break;

    case ProtocolType.GetLanguageSupport:
      languageManager.getLanguageSupport(pdu.data as GetLanguageSupport, socket);
      break;

    case ProtocolType.LanguageCommand:
      languageManager.testLanguages(pdu.data as LanguageCommand);
      break;

    default:
  }
}
