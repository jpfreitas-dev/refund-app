import { Request, Response } from 'express';
import { z } from 'zod';

import { sessionsService } from '@/services/sessions-service';

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'Email inválido' }),
      password: z.string().trim(),
    });

    const data = bodySchema.parse(request.body);

    const session = await sessionsService.create(data);

    return response.status(200).json(session);
  }
}

export { SessionsController };
