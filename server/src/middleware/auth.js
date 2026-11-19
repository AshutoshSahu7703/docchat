import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/asyncHandler.js';
export default function auth(req, _res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return next(new HttpError(401, 'Login required'));
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET).id; next(); }
  catch { next(new HttpError(401, 'Session expired, please login again')); }
}
