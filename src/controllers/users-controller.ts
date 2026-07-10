import { Request, Response } from 'express';
import { UserRole } from '../../generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/utils/AppError';
import { hash } from 'bcrypt';

class UsersController {
  async createUser(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: 'Name is required' }),
      email: z
        .string()
        .trim()
        .email({ message: 'Invalid email address' })
        .toLowerCase(),
      password: z
        .string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters long' }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError('Email already exists', 409);
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    response.status(201).json({ message: 'User created successfully' });
  }
}

export { UsersController };
