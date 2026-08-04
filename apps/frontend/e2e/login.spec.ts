import { test } from '@playwright/test';

import { createEmployee, signInThroughUi } from './helpers/api';

test('employee logs in through the sign-in page', async ({ page, request }) => {
  const email = `e2e-login-${Date.now()}@test.com`;

  await createEmployee(request, email);
  await signInThroughUi(page, email, '123456');
});
