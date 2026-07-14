import { Router } from 'express';

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated';

import { usersRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { refundsRoutes } from './refunds-routes';

const routes = Router();

// Public routes
routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

// Private routes
routes.use(ensureAuthenticated);
routes.use('/refunds', refundsRoutes);

export { routes };
