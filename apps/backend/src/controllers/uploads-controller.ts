import { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import z, { ZodError } from 'zod';

import uploadConfig from '@/config/upload';
import { DiskStorage } from '@/utils/disk-storage';
import { AppError } from '@/utils/AppError';

class UploadsController {
  async create(request: Request, response: Response) {
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

      const file = fileSchema.parse(request.file);

      const filename = await diskStorage.saveFile(file.filename);

      response.status(201).json({
        filename,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, 'tmp');
        }

        throw new AppError(error.issues[0].message, 400);
      }

      throw error;
    }
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      filename: z.string().min(1),
    });

    const { filename } = paramsSchema.parse(request.params);
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadConfig.UPLOADS_FOLDER, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    return response.sendFile(filePath);
  }
}

export { UploadsController };
