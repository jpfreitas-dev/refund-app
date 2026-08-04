import path from 'node:path';
import fs from 'node:fs';
import { ZodError, z } from 'zod';

import uploadConfig from '@/config/upload';
import { DiskStorage } from '@/utils/disk-storage';
import { AppError } from '@/utils/AppError';

class UploadsService {
  async create(file?: Express.Multer.File) {
    const diskStorage = new DiskStorage();

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: 'Um arquivo é obrigatório' }),
          mimetype: z
            .string()
            .refine((type) => uploadConfig.ACCEPTED_FILE_TYPES.includes(type), {
              message: `Tipo de arquivo inválido. Tipos aceitos: ${uploadConfig.ACCEPTED_FILE_TYPES.join(', ')}`,
            }),
          size: z
            .number()
            .positive()
            .max(uploadConfig.MAX_FILE_SIZE, {
              message: `Tamanho do arquivo excede o limite máximo de ${uploadConfig.MAX_SIZE} MB`,
            }),
        })
        .passthrough();

      const parsedFile = fileSchema.parse(file);

      const filename = await diskStorage.saveFile(parsedFile.filename);

      return { filename };
    } catch (error) {
      if (error instanceof ZodError) {
        if (file) {
          await diskStorage.deleteFile(file.filename, 'tmp');
        }

        throw new AppError(error.issues[0].message, 400);
      }

      throw error;
    }
  }

  resolveFilePath(filename: string) {
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadConfig.UPLOADS_FOLDER, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    return filePath;
  }
}

export const uploadsService = new UploadsService();
