import * as processManager from './task_manager';
import { Command, WorkerState } from 'dispatcher-protocol';

let state: WorkerState = WorkerState.Executing;

export function handleCommand(command: Command) {
  switch (command) {
    case Command.Pause:
      if (state === WorkerState.Paused) {
        return;
      }

      state = WorkerState.Paused;
      processManager.killAll();
      break;

    case Command.Resume:
      if (state === WorkerState.Executing) {
        return;
      }

      state = WorkerState.Executing;
      break;

    case Command.Stop:
      processManager.killAll();
      process.exit();
      break;

    default:
  }
}

export function getCurrentState(): WorkerState {
  return state;
}
