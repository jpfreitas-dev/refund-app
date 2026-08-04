import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';

type CreateRefundInput = {
  name: string;
  category: 'food' | 'others' | 'services' | 'transport' | 'accommodation';
  amount: number;
  filename: string;
  userId: string;
};

type ListRefundsInput = {
  name: string;
  page: number;
  perPage: number;
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

class RefundsService {
  async create({
    name,
    category,
    amount,
    filename,
    userId,
  }: CreateRefundInput) {
    return prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId,
      },
    });
  }

  async index({ name, page, perPage }: ListRefundsInput) {
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
          select: userSelect,
        },
      },
    });

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

    return {
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    };
  }

  async show(id: string) {
    const refund = await prisma.refunds.findFirst({
      where: { id },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    if (!refund) {
      throw new AppError('Reembolso não encontrado', 404);
    }

    return refund;
  }
}

export const refundsService = new RefundsService();
