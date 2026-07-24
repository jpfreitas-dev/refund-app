import { Request, Response } from 'express';
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
          filename: z.string().min(1, { message: 'File is required' }),
          mimetype: z
            .string()
            .refine((type) => uploadConfig.ACCEPTED_FILE_TYPES.includes(type), {
              message: `Invalid file type. Accepted types: ${uploadConfig.ACCEPTED_FILE_TYPES.join(', ')}`,
            }),
          size: z
            .number()
            .positive()
            .max(uploadConfig.MAX_FILE_SIZE, {
              message: `File size exceeds the maximum limit of ${uploadConfig.MAX_SIZE} MB`,
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
}

export { UploadsController };
