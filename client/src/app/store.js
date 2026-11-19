import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import docs from '../features/docs/docsSlice';
import chat from '../features/chat/chatSlice';
import ui from '../features/ui/uiSlice';

export const store = configureStore({ reducer: { auth, docs, chat, ui } });
