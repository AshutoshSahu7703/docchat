import multer from 'multer';
import { HttpError } from '../utils/asyncHandler.js';
const ok = ['application/pdf', 'text/plain', 'text/markdown'];
export default multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_r, f, cb) => (ok.includes(f.mimetype) ? cb(null, true) : cb(new HttpError(400, 'Only PDF, TXT or MD files allowed'))),
});
