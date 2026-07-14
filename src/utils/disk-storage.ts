import fs from 'node:fs';
import path from 'node:path';

import uploadConfig from '@/config/upload';

class DiskStorage {
  async saveFile(file: string) {
    const tmpPath: string = path.resolve(uploadConfig.TPM_FOLDER, file);
    const destinationPath: string = path.resolve(
      uploadConfig.UPLOADS_FOLDER,
      file,
    );

    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      throw (new Error(`File not found: ${file}`), { cause: error });
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true });
    await fs.promises.rename(tmpPath, destinationPath);

    return file;
  }

  async deleteFile(file: string, type: 'tmp' | 'uploads') {
    const pathFile: string =
      type === 'tmp' ? uploadConfig.TPM_FOLDER : uploadConfig.UPLOADS_FOLDER;

    const filePath: string = path.resolve(pathFile, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export { DiskStorage };
