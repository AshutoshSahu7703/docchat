import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { extractPages } from '../services/parser.js';
import { chunkPages } from '../utils/chunker.js';
import { embedTexts } from '../services/gemini.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ documents: await Document.find({ user: req.userId }).sort('-createdAt') });
});

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'No file received');
  const doc = await Document.create({ user: req.userId, name: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size });
  try {
    const pages = await extractPages(req.file);
    const chunks = chunkPages(pages);
    if (!chunks.length) throw new HttpError(422, 'No readable text found (scanned PDF?)');
    const vectors = await embedTexts(chunks.map((c) => c.text));
    await Chunk.insertMany(chunks.map((c, i) => ({ ...c, user: req.userId, doc: doc._id, embedding: vectors[i] })));
    Object.assign(doc, { status: 'ready', pages: pages.length, chunkCount: chunks.length });
    await doc.save();
    res.status(201).json({ document: doc });
  } catch (e) {
    doc.status = 'failed'; doc.error = e.message; await doc.save();
    throw e;
  }
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!doc) throw new HttpError(404, 'Document not found');
  await Chunk.deleteMany({ doc: doc._id });
  res.json({ id: doc._id });
});
