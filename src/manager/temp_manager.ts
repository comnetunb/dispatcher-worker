import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';

const tmpDir = `${__dirname}/../tmp/`;

export function getCWD(id: string): string {
  return `${tmpDir}/${id}/`;
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
    mkdirp(getCWD(id), (e) => {
      if (e) {
        reject(e);
      }

      fs.writeFile(getCWD(id) + fileName, data, (e2) => {
        if (e2) {
          reject(e2);
        } else {
          resolve();
        }
      });
    });
  });
};

export function remove(id: string): any {
  rimraf(getCWD(id), () => { });
};
