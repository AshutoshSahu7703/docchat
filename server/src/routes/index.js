import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import * as a from '../controllers/auth.js';
import * as d from '../controllers/document.js';
import * as c from '../controllers/chat.js';

const r = Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { message: 'Too many attempts, try later' } });
const chatLimit = rateLimit({ windowMs: 60 * 1000, limit: 20, message: { message: 'Slow down, 20 messages per minute max' } });

r.post('/auth/register', authLimit, a.register);
r.post('/auth/login', authLimit, a.login);
r.get('/auth/me', auth, a.me);

r.get('/documents', auth, d.list);
r.post('/documents', auth, upload.single('file'), d.upload);
r.delete('/documents/:id', auth, d.remove);

r.get('/chats', auth, c.list);
r.post('/chats', auth, c.create);
r.get('/chats/:id', auth, c.get);
r.delete('/chats/:id', auth, c.remove);
r.patch('/chats/:id/docs', auth, c.setDocs);
r.post('/chats/:id/messages', auth, chatLimit, c.sendMessage);
export default r;
