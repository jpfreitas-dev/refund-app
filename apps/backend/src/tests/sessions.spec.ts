import { describe, expect, it } from 'vitest';

import { agent, createEmployeeSession } from './helpers/request';

describe('POST /sessions', () => {
  it('returns token and user without password for valid credentials', async () => {
    const { email } = await createEmployeeSession('session-user@example.com');

    const response = await agent.post('/sessions').send({
      email,
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      email,
      role: 'employee',
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it('returns 401 for invalid password', async () => {
    await createEmployeeSession('wrong-password@example.com');

    const response = await agent.post('/sessions').send({
      email: 'wrong-password@example.com',
      password: '654321',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Email ou senha inválidos');
  });

  it('returns 401 for unknown email', async () => {
    const response = await agent.post('/sessions').send({
      email: 'unknown@example.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Email ou senha inválidos');
  });
});
