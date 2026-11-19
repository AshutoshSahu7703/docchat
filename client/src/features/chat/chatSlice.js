import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg, API_URL, getToken } from '../../lib/api';

let controller = null;
export const stopStreaming = () => controller?.abort();

export const fetchChats = createAsyncThunk('chat/list', async (_, { rejectWithValue }) => {
  try { return (await api.get('/chats')).data.chats; } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const openChat = createAsyncThunk('chat/open', async (id, { rejectWithValue }) => {
  try { return (await api.get(`/chats/${id}`)).data.chat; } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const createChat = createAsyncThunk('chat/create', async (docIds = [], { rejectWithValue }) => {
  try { return (await api.post('/chats', { docIds })).data.chat; } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const deleteChat = createAsyncThunk('chat/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/chats/${id}`); return id; } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const setChatDocs = createAsyncThunk('chat/setDocs', async ({ id, docIds }, { rejectWithValue }) => {
  try { return (await api.patch(`/chats/${id}/docs`, { docIds })).data.chat; } catch (e) { return rejectWithValue(errMsg(e)); }
});

// Streams the answer over SSE (fetch + ReadableStream, because EventSource can't POST)
export const sendMessage = createAsyncThunk('chat/send', async ({ chatId, content }, { dispatch }) => {
  dispatch(slice.actions.streamStart(content));
  controller = new AbortController();
  try {
    const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Request failed');
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split('\n\n'); buf = parts.pop();
      for (const p of parts) {
        const ev = /event: (.+)/.exec(p)?.[1]; const raw = /data: (.+)/s.exec(p)?.[1];
        if (!ev || !raw) continue;
        const data = JSON.parse(raw);
        if (ev === 'sources') dispatch(slice.actions.streamSources(data));
        if (ev === 'token') dispatch(slice.actions.streamToken(data));
        if (ev === 'error') dispatch(slice.actions.streamError(data.message));
        if (ev === 'done') dispatch(slice.actions.streamDone(data));
      }
    }
  } catch (e) {
    if (e.name !== 'AbortError') dispatch(slice.actions.streamError(e.message));
  } finally {
    dispatch(slice.actions.streamEnd());
    dispatch(fetchChats());
  }
});

const slice = createSlice({
  name: 'chat',
  initialState: { list: [], active: null, loading: false, streaming: false, streamText: '', streamSources: [], error: null },
  reducers: {
    clearActive: (s) => { s.active = null; s.error = null; },
    streamStart: (s, a) => {
      s.streaming = true; s.streamText = ''; s.streamSources = []; s.error = null;
      s.active.messages.push({ _id: `tmp-${Date.now()}`, role: 'user', content: a.payload });
    },
    streamSources: (s, a) => { s.streamSources = a.payload; },
    streamToken: (s, a) => { s.streamText += a.payload; },
    streamError: (s, a) => { s.error = a.payload; },
    streamDone: (s, a) => { if (s.active) s.active.title = a.payload.title; },
    streamEnd: (s) => {
      if (s.streamText && s.active) s.active.messages.push({ _id: `a-${Date.now()}`, role: 'assistant', content: s.streamText, sources: s.streamSources });
      s.streaming = false; s.streamText = ''; s.streamSources = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchChats.fulfilled, (s, a) => { s.list = a.payload; })
      .addCase(openChat.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(openChat.fulfilled, (s, a) => { s.loading = false; s.active = a.payload; })
      .addCase(openChat.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createChat.fulfilled, (s, a) => { s.active = a.payload; s.list.unshift(a.payload); })
      .addCase(setChatDocs.fulfilled, (s, a) => { if (s.active?._id === a.payload._id) s.active.docIds = a.payload.docIds; })
      .addCase(deleteChat.fulfilled, (s, a) => { s.list = s.list.filter((c) => c._id !== a.payload); if (s.active?._id === a.payload) s.active = null; });
  },
});
export const { clearActive } = slice.actions;
export default slice.reducer;
