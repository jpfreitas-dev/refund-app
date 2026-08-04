import { prisma } from '@/lib/prisma';
import { authConfig } from '@/config/auth';
import jwt from 'jsonwebtoken';
import { AppError } from '@/utils/AppError';
import { compare } from 'bcrypt';

type CreateSessionInput = {
  email: string;
  password: string;
};

class SessionsService {
  async create({ email, password }: CreateSessionInput) {
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

    return {
      token,
      user: userWithoutPassword,
    };
  }
}

export const sessionsService = new SessionsService();
