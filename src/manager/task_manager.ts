import { exec, ExecOptions, ExecException, ChildProcess } from 'child_process';
import { TaskInfo } from 'dispatcher-protocol';

interface TaskExec {
  taskId: string,
  startTime: Date,
  process: ChildProcess
}

const tasks: {
  [id: string]: TaskExec,
} = {};

export function execTask(commandLine: string, id: string, options: ExecOptions,
  callback: (id: string, err: ExecException | null, stdout: string, stderr: string) => void): void {

  // make sure we are not running this task
  kill(id);

  const childProcess = exec(commandLine, options, (err, stdout, stderr) => {

    if (tasks[id] && childProcess.pid === tasks[id].process.pid) {
      // task is finished, remove from map
      delete tasks[id];
    }
    callback(id, err, stdout, stderr);
  });

  if (tasks[id] === undefined) {
    tasks[id] = {
      taskId: id,
      startTime: new Date(),
      process: childProcess,
    };
  } else {
    childProcess.kill('SIGKILL');
  }
};

export function getTasks(): TaskExec[] {
  const taskList: TaskExec[] = [];

  for (var key in tasks) {
    taskList.push(tasks[key]);
  }

  return taskList;
};

/**
* @param id process second identification (this is not the PID)
*/
export function kill(id: string): boolean {
  if (tasks[id] && tasks[id].process) {
    tasks[id].process.kill('SIGKILL');
    delete tasks[id];
    return true;
  }
  return false;
};

export function killAll(): void {
  const taskList = getTasks();
  for (let i = 0; i < taskList.length; i += 1) {
    taskList[i].process.kill('SIGKILL');
    delete tasks[taskList[i].taskId];
  }
};

process.on('exit', function () {
  killAll();
});
