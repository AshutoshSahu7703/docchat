const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const key = () => process.env.GEMINI_API_KEY;
const EMBED = () => process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
const CHAT = () => process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
const norm = (v) => { const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1; return v.map((x) => x / n); };

async function call(url, body, signal) {
  const res = await fetch(url, { method: 'POST', signal, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key() }, body: JSON.stringify(body) });
  if (!res.ok) throw Object.assign(new Error(`Gemini error ${res.status}: ${(await res.text()).slice(0, 200)}`), { status: 502 });
  return res;
}

export async function embedTexts(texts, taskType = 'RETRIEVAL_DOCUMENT') {
  const out = [];
  for (let i = 0; i < texts.length; i += 50) {
    const batch = texts.slice(i, i + 50);
    const res = await call(`${BASE}/models/${EMBED()}:batchEmbedContents`, {
      requests: batch.map((t) => ({ model: `models/${EMBED()}`, content: { parts: [{ text: t }] }, taskType, outputDimensionality: 768 })),
    });
    const data = await res.json();
    out.push(...data.embeddings.map((e) => norm(e.values)));
  }
  return out;
}

export async function* streamAnswer({ system, history, signal }) {
  const res = await call(`${BASE}/models/${CHAT()}:streamGenerateContent?alt=sse`, {
    systemInstruction: { parts: [{ text: system }] },
    contents: history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { temperature: 0.3 },
  }, signal);
  const decoder = new TextDecoder();
  let buf = '';
  for await (const part of res.body) {
    buf += decoder.decode(part, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const l of lines) {
      if (!l.startsWith('data:')) continue;
      try {
        const j = JSON.parse(l.slice(5));
        const t = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
        if (t) yield t;
      } catch { /* partial json, skip */ }
    }
  }
}
