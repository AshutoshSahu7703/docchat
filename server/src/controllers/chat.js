import Chat from '../models/Chat.js';
import Document from '../models/Document.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { retrieve, buildSystemPrompt } from '../services/rag.js';
import { streamAnswer } from '../services/gemini.js';

const own = async (req) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
  if (!chat) throw new HttpError(404, 'Chat not found');
  return chat;
};

export const list = asyncHandler(async (req, res) => {
  res.json({ chats: await Chat.find({ user: req.userId }).select('title docIds updatedAt').sort('-updatedAt') });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ chat: await Chat.create({ user: req.userId, docIds: req.body.docIds || [] }) });
});
export const get = asyncHandler(async (req, res) => res.json({ chat: await own(req) }));
export const remove = asyncHandler(async (req, res) => {
  const chat = await own(req); await chat.deleteOne(); res.json({ id: chat._id });
});
export const setDocs = asyncHandler(async (req, res) => {
  const chat = await own(req); chat.docIds = req.body.docIds || []; await chat.save(); res.json({ chat });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const chat = await own(req);
  const content = (req.body.content || '').trim();
  if (!content) throw new HttpError(400, 'Message is empty');
  const ready = await Document.find({ user: req.userId, status: 'ready', ...(chat.docIds.length ? { _id: { $in: chat.docIds } } : {}) }).select('_id');
  if (!ready.length) throw new HttpError(400, 'Upload a document first (or select a ready one)');

  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  const ac = new AbortController();
  res.on('close', () => ac.abort());

  let answer = '';
  let sources = [];
  try {
    sources = await retrieve(req.userId, ready.map((d) => d._id), content);
    send('sources', sources);
    chat.messages.push({ role: 'user', content });
    if (chat.messages.length === 1) chat.title = content.slice(0, 48);
    const history = chat.messages.slice(-7);
    for await (const t of streamAnswer({ system: buildSystemPrompt(sources), history, signal: ac.signal })) {
      answer += t; send('token', t);
    }
  } catch (e) {
    if (!ac.signal.aborted) send('error', { message: e.message });
  }
  if (answer) chat.messages.push({ role: 'assistant', content: answer, sources });
  await chat.save();
  send('done', { title: chat.title });
  res.end();
});
