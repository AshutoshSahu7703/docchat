import { createSlice } from '@reduxjs/toolkit';

const initialTheme = () => {
  try { return localStorage.getItem('docchat_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  catch { return 'light'; }
};

const slice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, sourcesPanel: null, theme: initialTheme() },
  reducers: {
    toggleSidebar: (s, a) => { s.sidebarOpen = a.payload ?? !s.sidebarOpen; },
    openSources: (s, a) => { s.sourcesPanel = a.payload; },
    closeSources: (s) => { s.sourcesPanel = null; },
    toggleTheme: (s) => { s.theme = s.theme === 'dark' ? 'light' : 'dark'; },
  },
});
export const { toggleSidebar, openSources, closeSources, toggleTheme } = slice.actions;
export default slice.reducer;
