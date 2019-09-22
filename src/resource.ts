import * as os from 'os';
import { exec, ExecOptions } from 'child_process';

export interface ExecOutput {
  stdout: string,
  stderr: string,
}

export function getAvailableMemory(): number {
  return os.freemem() / os.totalmem();
};

// https://github.com/oscmejia/os-utils/blob/4210697ff3b412643e1b4061ebf9ec727a7fe9b7/lib/osutils.js
function getCPUInfo(): { idle: number, total: number } {
  const cpus = os.cpus();

  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;
  let total = 0;

  for (let cpu in cpus) {
    if (!cpus.hasOwnProperty(cpu)) continue;
    user += cpus[cpu].times.user;
    nice += cpus[cpu].times.nice;
    sys += cpus[cpu].times.sys;
    irq += cpus[cpu].times.irq;
    idle += cpus[cpu].times.idle;
  }

  total = user + nice + sys + idle + irq;

  return {
    idle,
    total,
  };
}

// https://github.com/oscmejia/os-utils/blob/4210697ff3b412643e1b4061ebf9ec727a7fe9b7/lib/osutils.js
// had trouble with TS, decided to copy the relevant code
function getCpuUsage(callback: (perc: number) => void, free: boolean = false): void {

  var stats1 = getCPUInfo();
  var startIdle = stats1.idle;
  var startTotal = stats1.total;

  setTimeout(function () {
    var stats2 = getCPUInfo();
    var endIdle = stats2.idle;
    var endTotal = stats2.total;

    var idle = endIdle - startIdle;
    var total = endTotal - startTotal;
    var perc = idle / total;

    if (free === true)
      callback(perc);
    else
      callback((1 - perc));

  }, 1000);
}

export function getCpuUsageAsync(): Promise<number> {
  const promise = new Promise<number>((resolve) => {
    getCpuUsage((cpuUsage) => {
      resolve(cpuUsage);
    });
  });
  return promise;
}

export function execAsync(command: string, options: ExecOptions = {}): Promise<ExecOutput> {
  const promise = new Promise<ExecOutput>((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) reject(err);
      else {
        resolve({
          stdout,
          stderr
        });
      }
    });
  });
  return promise;
};
