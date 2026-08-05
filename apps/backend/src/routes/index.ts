import { Router } from 'express';

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated';

import { usersRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { refundsRoutes } from './refunds-routes';
import { uploadsRoutes } from './uploads-routes';

const routes = Router();

// This route is used to check if the server is running, it returns a 200 status code and a JSON object with the status 'ok'
routes.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

// Public routes
routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

// Private routes
routes.use(ensureAuthenticated);
routes.use('/refunds', refundsRoutes);
routes.use('/uploads', uploadsRoutes);

export { routes };
