import { Request, Response } from 'express';
import { z } from 'zod';
import { usersService } from '@/services/users-service';

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

    const data = bodySchema.parse(request.body);

    await usersService.create(data);

    response.status(201).json({ message: 'User created successfully' });
  }
}

export { UsersController };
