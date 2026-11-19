import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg, getToken } from '../../lib/api';

const save = (d) => localStorage.setItem('docchat_token', d.token);

export const login = createAsyncThunk('auth/login', async (body, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/login', body); save(data); return data.user; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});
export const register = createAsyncThunk('auth/register', async (body, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/register', body); save(data); return data.user; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});
export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  // Retry a few times: a sleeping free server (e.g. Render) can take ~1 min to wake up
  for (let i = 0; i < 4; i++) {
    try { return (await api.get('/auth/me', { timeout: 20000 })).data.user; }
    catch (e) {
      // only a real 401 means the token is bad; network/server errors keep the login
      if (e.response?.status === 401) { localStorage.removeItem('docchat_token'); return rejectWithValue(errMsg(e)); }
      if (i === 3) return rejectWithValue(errMsg(e));
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, bootstrapped: !getToken(), error: null },
  reducers: {
    logout: (s) => { localStorage.removeItem('docchat_token'); s.user = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.bootstrapped = true; })
      .addCase(fetchMe.rejected, (s) => { s.bootstrapped = true; });
    for (const t of [login, register]) {
      b.addCase(t.pending, (s) => { s.loading = true; s.error = null; })
        .addCase(t.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
        .addCase(t.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    }
  },
});
export const { logout } = slice.actions;
export default slice.reducer;
