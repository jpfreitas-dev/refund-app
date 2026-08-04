import { hash } from 'bcrypt';
import supertest from 'supertest';

import { app } from '@/app';
import { prisma } from '@/lib/prisma';

export const agent = supertest(app);

export async function createEmployeeSession(email?: string) {
  const uniqueEmail = email ?? `employee-${Date.now()}@test.com`;

  await agent.post('/users').send({
    name: 'Test Employee',
    email: uniqueEmail,
    password: '123456',
  });

  const response = await agent.post('/sessions').send({
    email: uniqueEmail,
    password: '123456',
  });

  return {
    token: response.body.token as string,
    user: response.body.user,
    email: uniqueEmail,
  };
}

export async function createManagerSession() {
  const email = `manager-${Date.now()}@test.com`;
  const password = '123456';

  await prisma.user.create({
    data: {
      name: 'Test Manager',
      email,
      password: await hash(password, 8),
      role: 'manager',
    },
  });

  const response = await agent.post('/sessions').send({ email, password });

  return {
    token: response.body.token as string,
    user: response.body.user,
    email,
  };
}
