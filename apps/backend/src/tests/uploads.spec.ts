import { describe, expect, it } from 'vitest';

import { agent, createEmployeeSession } from './helpers/request';

describe('GET /uploads/:filename', () => {
  it('returns 401 without authentication', async () => {
    const response = await agent.get('/uploads/missing-file.pdf');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido');
  });

  it('returns 404 for authenticated users when file does not exist', async () => {
    const { token } = await createEmployeeSession();

    const response = await agent
      .get('/uploads/missing-file.pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Arquivo não encontrado');
  });
});
