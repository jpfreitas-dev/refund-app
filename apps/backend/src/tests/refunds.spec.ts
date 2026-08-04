import { describe, expect, it } from 'vitest';

import {
  agent,
  createEmployeeSession,
  createManagerSession,
} from './helpers/request';

describe('Refunds routes', () => {
  it('returns 401 when creating a refund without token', async () => {
    const response = await agent.post('/refunds').send({
      name: 'Almoço',
      category: 'food',
      amount: 45.5,
      filename: '0123456789012345678901',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido');
  });

  it('allows employees to create refunds', async () => {
    const { token } = await createEmployeeSession();

    const response = await agent
      .post('/refunds')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        category: 'food',
        amount: 45.5,
        filename: '0123456789012345678901',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Almoço',
      category: 'food',
      amount: 45.5,
    });
  });

  it('forbids employees from listing refunds', async () => {
    const { token } = await createEmployeeSession();

    const response = await agent
      .get('/refunds')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Acesso proibido');
  });

  it('allows managers to list refunds', async () => {
    const employee = await createEmployeeSession();
    const manager = await createManagerSession();

    await agent
      .post('/refunds')
      .set('Authorization', `Bearer ${employee.token}`)
      .send({
        name: 'Transporte',
        category: 'transport',
        amount: 20,
        filename: '0123456789012345678901',
      });

    const response = await agent
      .get('/refunds')
      .set('Authorization', `Bearer ${manager.token}`);

    expect(response.status).toBe(200);
    expect(response.body.refunds).toHaveLength(1);
    expect(response.body.refunds[0].user.password).toBeUndefined();
  });
});
