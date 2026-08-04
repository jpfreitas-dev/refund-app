import { describe, expect, it } from 'vitest';

import { agent } from './helpers/request';

describe('POST /users', () => {
  it('creates a user with valid payload', async () => {
    const response = await agent.post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created successfully' });
  });

  it('returns 409 when email is already in use', async () => {
    const payload = {
      name: 'John Doe',
      email: 'duplicate@example.com',
      password: '123456',
    };

    await agent.post('/users').send(payload);

    const response = await agent.post('/users').send({
      ...payload,
      name: 'Jane Doe',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('O email já está sendo usado');
  });

  it('returns 400 for invalid payload', async () => {
    const response = await agent.post('/users').send({
      name: 'Jo',
      email: 'invalid-email',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Erro de validação');
  });
});
