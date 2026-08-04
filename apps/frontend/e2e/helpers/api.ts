import { expect, type APIRequestContext } from '@playwright/test';

const API_URL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3333';

export async function createEmployee(
  request: APIRequestContext,
  email: string,
  password = '123456',
) {
  const response = await request.post(`${API_URL}/users`, {
    data: {
      name: 'E2E Employee',
      email,
      password,
    },
  });

  expect(response.status()).toBe(201);

  return { email, password };
}

export async function signInThroughUi(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
) {
  await page.goto('/');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('senha123').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(
    page.getByRole('heading', { name: 'Solicitação de reembolso' }),
  ).toBeVisible();
}
