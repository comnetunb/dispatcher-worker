import { TerminateTask, TerminateTaskResponse, ProtocolType, ReturnCode } from "dispatcher-protocol";
import { kill } from "../../manager/task_manager";
import { send } from "process";
import { logger } from "../../logger";

export function execute(pdu: TerminateTask, socket: SocketIOClient.Socket): void {
  const taskId = pdu.taskId;

  const found = kill(taskId);
  const response: TerminateTaskResponse = {
    type: ProtocolType.TerminateTaskResponse,
    taskId,
    code: ReturnCode.Success,
  }

  send(response, (err => {
    if (err) logger.error(err, "Could not send terminate task response");
  }));
};
