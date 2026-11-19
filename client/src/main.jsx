import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import router from './App';
import './index.css';

const applyTheme = () => {
  const t = store.getState().ui.theme;
  document.documentElement.classList.toggle('dark', t === 'dark');
  localStorage.setItem('docchat_theme', t);
};
applyTheme();
store.subscribe(applyTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster position="top-right" toastOptions={{ style: { fontSize: 14 } }} />
  </Provider>
);
