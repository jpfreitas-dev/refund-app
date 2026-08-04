import { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '@/utils/AppError';
import { refundsService } from '@/services/refunds-service';

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, 'Nome é obrigatório'),
      category: z.enum([
        'food',
        'others',
        'services',
        'transport',
        'accommodation',
      ]),
      amount: z.number().positive('Informe um valor válido e superior a 0'),
      filename: z.string().min(20, 'Nome do arquivo é obrigatório'),
    });

    const data = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError('Não autorizado', 401);
    }

    const refund = await refundsService.create({
      ...data,
      userId: request.user.id,
    });

    response.status(201).json(refund);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(''),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const query = querySchema.parse(request.query);

    const result = await refundsService.index(query);

    response.status(200).json(result);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const refund = await refundsService.show(id);

    response.status(200).json(refund);
  }
}

export { RefundsController };
