import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as os from 'os';
import * as path from 'path';

const tmpDir = os.tmpdir();

export function getCWD(id: string): string {
  return path.join(tmpDir, id);
};


export function clean(): void {
  // fs.readdir(tmpDir, function (err, files) {
  //   if (err) {
  //     throw err
  //   } else {
  //     for (const file of files) {
  //       fs.unlink(path.join(tmpDir, file), err => {
  //         if (err) {
  //           console.log(err)
  //         }
  //       })
  //     }
  //   }
  // })
};

export function create(id: string, fileName: string, data: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const dir = getCWD(id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, fileName);
    fs.writeFile(filePath, data, (e2) => {
      if (e2) {
        reject(e2);
      } else {
        resolve();
      }
    });
  })
};

export function remove(id: string): any {
  rimraf(getCWD(id), () => { });
};
