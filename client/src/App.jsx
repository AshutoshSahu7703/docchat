import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, GuestOnly } from './components/RouteGuards';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { element: <GuestOnly />, children: [
    { path: '/login', element: <AuthPage mode="login" /> },
    { path: '/register', element: <AuthPage mode="register" /> },
  ] },
  { path: '/app', element: <ProtectedRoute />, children: [
    { element: <AppLayout />, children: [
      { index: true, element: <Dashboard /> },
      { path: 'documents', element: <Documents /> },
      { path: 'chat', element: <Chat /> },
      { path: 'chat/:chatId', element: <Chat /> },
    ] },
  ] },
  { path: '*', element: <NotFound /> },
]);
export default router;
