import { UserRole } from '../../generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { hash } from 'bcrypt';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

class UsersService {
  async create({ name, email, password }: CreateUserInput) {
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
  }
}

export const usersService = new UsersService();
