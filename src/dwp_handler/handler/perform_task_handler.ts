// @ts-ignore
import * as parseDataUrl from 'parse-data-url';
import * as net from 'net';
import { logger } from '../../logger';
import { PerformTask, WorkerState, PerformTaskResponse, ProtocolType, ReturnCode, EncapsulatePDU, TaskResult } from 'dispatcher-protocol';

// Management Related
import * as taskManager from './../../manager/task_manager';
import * as stateManager from './../../manager/state_manager';
import * as tempManager from './../../manager/temp_manager';

export function execute(pdu: PerformTask, socket: net.Socket): Promise<void> {
  if (stateManager.getCurrentState() === WorkerState.Paused) {
    return;
  }

  logger.debug('New task received!');
  try {
    return Promise
      .all(pdu.files.map((file) => {
        const parsed = parseDataUrl(file.dataURL);
        return tempManager.create(pdu.task.id, file.name, parsed.toBuffer());
      }))
      .then(() => {
        const response: PerformTaskResponse = {
          type: ProtocolType.PerformTaskResponse,
          task: pdu.task,
          code: ReturnCode.Executing,
        }
        socket.write(EncapsulatePDU(response));

        const options = {
          cwd: tempManager.getCWD(pdu.task.id)
        };
        taskManager.execTask(
          pdu.commandLine, pdu.task.id, options,
          (id, err, stdout, stderr) => {
            tempManager.remove(id);
            const taskResult: TaskResult = {
              type: ProtocolType.TaskResult,
              task: pdu.task,
              code: ReturnCode.Executing,
              output: '',
            }

            if (err) {
              logger.error(`Simulation has finished with error.\n${err}`);
              taskResult.code = ReturnCode.Error;
              taskResult.output = err.message;
            } else if (stderr) {
              logger.error(`Simulation has finished with error.\n${stderr}`);

              taskResult.code = ReturnCode.Error;
              taskResult.output = stderr;
            } else {
              logger.info('Simulation has finished with success');

              taskResult.code = ReturnCode.Success;
              taskResult.output = stdout.replace(new RegExp('NaN,', 'g'), 'null,');
            }

            return socket.write(EncapsulatePDU(taskResult));
          }
        );
      })
      .catch((e) => {
        logger.error(e);
      });
  } catch (e) {
    logger.error(e);
  }
};
