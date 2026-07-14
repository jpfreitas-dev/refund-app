import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const TPM_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
const UPLOADS_FOLDER = path.resolve(TPM_FOLDER, 'uploads');

const MAX_SIZE = 3; // MB
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  // 'application/pdf',
];

const MULTER = {
  storage: multer.diskStorage({
    destination: TPM_FOLDER,
    filename: (request, file, callback) => {
      const fileHesh = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHesh}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default {
  TPM_FOLDER,
  UPLOADS_FOLDER,
  MAX_SIZE,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  MULTER,
};
