import { GetReport, Report, ProtocolType, EncapsulatePDU } from "dispatcher-protocol";
import * as resource from '../../resource';
import * as Config from '../../configuration';
import * as stateManager from './../../manager/state_manager';
import * as taskManager from './../../manager/task_manager';
import * as languageManager from './../../manager/language_manager';
import * as net from 'net';
import { send } from "../../communication";

const configuration = Config.getConfiguration();

export async function execute(pdu: GetReport, socket: SocketIOClient.Socket): Promise<void> {
  const response: Report = {
    type: ProtocolType.Report,
  };

  if (pdu.resources) {
    response.resources = {
      cpu: await resource.getCpuUsageAsync(),
      memory: resource.getUsedMemory(),
    };
  }

  if (pdu.state) {
    response.state = {
      state: stateManager.getCurrentState(),
    };
  }

  if (pdu.tasks) {
    response.tasks = {
      tasks: taskManager.getTasks(),
    };
  }

  if (pdu.supportedLanguages) {
    response.languages = {
      languages: languageManager.getSupportedLanguages(),
    }
  }

  send(response);
};
