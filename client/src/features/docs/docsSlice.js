import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../../lib/api';

export const fetchDocs = createAsyncThunk('docs/fetch', async (_, { rejectWithValue }) => {
  try { return (await api.get('/documents')).data.documents; } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const uploadDoc = createAsyncThunk('docs/upload', async (file, { rejectWithValue }) => {
  try {
    const fd = new FormData(); fd.append('file', file);
    return (await api.post('/documents', fd)).data.document;
  } catch (e) { return rejectWithValue(errMsg(e)); }
});
export const deleteDoc = createAsyncThunk('docs/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/documents/${id}`); return id; } catch (e) { return rejectWithValue(errMsg(e)); }
});

const slice = createSlice({
  name: 'docs',
  initialState: { items: [], loading: false, uploading: 0 },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDocs.pending, (s) => { s.loading = true; })
      .addCase(fetchDocs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchDocs.rejected, (s) => { s.loading = false; })
      .addCase(uploadDoc.pending, (s) => { s.uploading += 1; })
      .addCase(uploadDoc.fulfilled, (s, a) => { s.uploading -= 1; s.items.unshift(a.payload); })
      .addCase(uploadDoc.rejected, (s) => { s.uploading -= 1; })
      .addCase(deleteDoc.fulfilled, (s, a) => { s.items = s.items.filter((d) => d._id !== a.payload); });
  },
});
export default slice.reducer;
