import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

import { createEmployee, signInThroughUi } from './helpers/api';

const fixturePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/receipt.png',
);

test('employee creates a refund request', async ({ page, request }) => {
  const email = `e2e-refund-${Date.now()}@test.com`;

  await createEmployee(request, email);
  await signInThroughUi(page, email, '123456');

  await page
    .locator('fieldset')
    .filter({ hasText: 'Nome da solicitação' })
    .locator('input')
    .fill('Almoço com cliente');

  await page
    .locator('fieldset')
    .filter({ hasText: 'Categoria' })
    .locator('select')
    .selectOption('food');

  await page
    .locator('fieldset')
    .filter({ hasText: 'Valor' })
    .locator('input')
    .fill('45,50');

  await page.locator('#upload').setInputFiles(fixturePath);

  await page.getByRole('button', { name: 'Enviar solicitação' }).click();

  await expect(
    page.getByRole('heading', { name: 'Solicitação enviada!' }),
  ).toBeVisible();
});
