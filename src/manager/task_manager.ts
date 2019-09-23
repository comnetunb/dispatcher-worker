import { exec, ExecOptions, ExecException } from 'child_process';
import { TaskInfo } from 'dispatcher-protocol';

const tasks: {
  [id: string]: TaskInfo,
} = {};

export function execTask(commandLine: string, id: string, options: ExecOptions,
  callback: (id: string, err: ExecException | null, stdout: string, stderr: string) => void): void {

  const childProcess = exec(commandLine, options, (err, stdout, stderr) => {
    delete tasks[id];
    callback(id, err, stdout, stderr);
  });

  if (tasks[id] === undefined) {
    tasks[id] = {
      id,
      startTime: new Date(),
      pid: childProcess.pid,
    };
  }
};

export function getTasks(): TaskInfo[] {
  const taskList: TaskInfo[] = [];

  for (var key in tasks) {
    taskList.push(tasks[key]);
  }

  return taskList;
};

/**
* @param id process second identification (this is not the PID)
*/
export function kill(id: string): void {
  if (tasks[id] && tasks[id].pid) {
    process.kill(tasks[id].pid);
  }
};

export function killAll(): void {
  const taskList = getTasks();
  for (let i = 0; i < taskList.length; i += 1) {
    process.kill(taskList[i].pid);
    delete tasks[taskList[i].id];
  }
};
