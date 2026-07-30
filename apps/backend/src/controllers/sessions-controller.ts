import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/config/auth';
import jwt from 'jsonwebtoken';
import { AppError } from '@/utils/AppError';
import { compare } from 'bcrypt';

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'Email inválido' }),
      password: z.string().trim(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
