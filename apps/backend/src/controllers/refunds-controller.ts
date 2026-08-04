import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';

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

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError('Não autorizado', 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    response.status(201).json(refund);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(''),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // return the total count of refunds for pagination
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    response.status(200).json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const refund = await prisma.refunds.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!refund) {
      throw new AppError('Reembolso não encontrado', 404);
    }

    response.status(200).json(refund);
  }
}

export { RefundsController };
