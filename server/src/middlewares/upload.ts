import multer from 'multer';
import { BadRequestError } from '../utils/customErrors';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fieldSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype))
      return callback(new BadRequestError('Formato de archivo no permitido.'));

    callback(null, true);
  },
});

export default upload;
