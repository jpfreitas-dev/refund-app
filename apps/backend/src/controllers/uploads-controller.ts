import { Request, Response } from 'express';
import { z } from 'zod';

import { uploadsService } from '@/services/uploads-service';

class UploadsController {
  async create(request: Request, response: Response) {
    const result = await uploadsService.create(request.file);

    return response.status(201).json(result);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      filename: z.string().min(1),
    });

    const { filename } = paramsSchema.parse(request.params);
    const filePath = uploadsService.resolveFilePath(filename);

    return response.sendFile(filePath);
  }
}

export { UploadsController };
