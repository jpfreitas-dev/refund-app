import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@/config/upload';

import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization';
import { UploadsController } from '@/controllers/uploads-controller';

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

const upload = multer(uploadConfig.MULTER);

uploadsRoutes.post(
  '/',
  verifyUserAuthorization(['employee']),
  upload.single('file'),
  uploadsController.create,
);

uploadsRoutes.get(
  '/:filename',
  verifyUserAuthorization(['employee', 'manager']),
  uploadsController.show,
);

export { uploadsRoutes };
