# DocChat - RAG: Chat with your documents (MERN + Gemini)

Upload PDF/TXT/MD, ask questions, get streamed answers with page-level citations.

**Stack:** React 18, Redux Toolkit, React Router 6, Tailwind v4, Vite | Node, Express, MongoDB (Mongoose), JWT, Gemini API (embeddings + chat), SSE streaming.

## Run locally
1. MongoDB Atlas cluster banao, Gemini API key lo (https://aistudio.google.com/apikey).
2. Server:
   ```
   cd server
   cp .env.example .env     # values bharo
   npm install
   npm run dev
   ```
3. Client (naye terminal me):
   ```
   cd client
   npm install
   npm run dev
   ```
4. http://localhost:5173 kholo, register karo, PDF upload karo, chat karo.

## How RAG works here
upload -> extract text per page -> chunk (220 words, 40 overlap) -> embeddings (768-dim) -> stored in MongoDB
question -> query embedding -> top-5 similar chunks (scoped to your userId + selected docs) -> Gemini answers using only those chunks -> streamed over SSE with sources.

## Atlas Vector Search (optional, scale ke liye)
Default me cosine similarity app ke andar hoti hai (small data ke liye perfect). Production style ke liye:
1. Atlas -> Search Indexes -> collection `chunks` -> index name `chunk_vector`, JSON:
```
{ "fields": [
  { "type": "vector", "path": "embedding", "numDimensions": 768, "similarity": "cosine" },
  { "type": "filter", "path": "user" },
  { "type": "filter", "path": "doc" }
] }
```
2. `server/.env` me `USE_ATLAS_VECTOR=true`.

## Deploy
- Client: Vercel (root `client`, env `VITE_API_URL=https://<your-api>/api`)
- Server: Render (root `server`, start `npm start`, saari .env values; `CLIENT_URL` me Vercel URL)

## Resume bullets (apne numbers se replace karna)
- Built a full-stack RAG app (React, Redux Toolkit, Node, MongoDB) answering questions over user PDFs with page-level citations.
- Implemented chunking + Gemini embeddings + cosine / Atlas vector retrieval, streaming responses over SSE.
- Secured with JWT auth, per-user data isolation and rate limiting; deployed on Vercel + Render.
