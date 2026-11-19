import mongoose from 'mongoose';
import Chunk from '../models/Chunk.js';
import Document from '../models/Document.js';
import { embedTexts } from './gemini.js';

const oid = (id) => new mongoose.Types.ObjectId(id);

export async function retrieve(userId, docIds, question, k = 5) {
  const [qv] = await embedTexts([question], 'RETRIEVAL_QUERY');
  let hits;
  if (process.env.USE_ATLAS_VECTOR === 'true') {
    hits = await Chunk.aggregate([
      { $vectorSearch: { index: 'chunk_vector', path: 'embedding', queryVector: qv, numCandidates: 100, limit: k,
          filter: { user: oid(userId), doc: { $in: docIds.map(oid) } } } },
      { $project: { text: 1, page: 1, doc: 1, score: { $meta: 'vectorSearchScore' } } },
    ]);
  } else {
    const all = await Chunk.find({ user: userId, doc: { $in: docIds } }).select('+embedding').lean();
    hits = all.map((c) => ({ ...c, score: c.embedding.reduce((s, x, i) => s + x * qv[i], 0) }))
      .sort((a, b) => b.score - a.score).slice(0, k);
  }
  const docs = await Document.find({ _id: { $in: [...new Set(hits.map((h) => String(h.doc)))] } }).select('name').lean();
  const names = Object.fromEntries(docs.map((d) => [String(d._id), d.name]));
  return hits.map((h) => ({ docId: h.doc, docName: names[String(h.doc)], page: h.page, snippet: h.text, score: Number(h.score.toFixed(3)) }));
}

export const buildSystemPrompt = (sources) => `You are DocChat, an assistant that answers questions strictly from the user's documents.
Rules:
- Use ONLY the context below. If the answer is not in it, say you could not find it in the selected documents.
- Cite the sources you used inline like [1], [2] matching the numbers in the context.
- Be clear and concise. Use markdown (lists, bold, tables) when it helps.
- Reply in the same language the user writes in (Hinglish is fine).

CONTEXT:
${sources.map((s, i) => `[${i + 1}] (${s.docName}, page ${s.page})\n${s.snippet}`).join('\n\n')}`;
