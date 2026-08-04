import { Request, Response } from 'express';
import { UserRole } from '../../generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/utils/AppError';
import { hash } from 'bcrypt';

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),
      email: z
        .string()
        .trim()
        .email({ message: 'Email inválido' })
        .toLowerCase(),
      password: z
        .string()
        .trim()
        .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError('O email já está sendo usado', 409);
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.employee,
      },
    });

    response.status(201).json({ message: 'User created successfully' });
  }
}

export { UsersController };
