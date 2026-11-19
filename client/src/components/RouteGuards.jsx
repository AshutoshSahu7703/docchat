import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { fetchMe } from '../features/auth/authSlice';
import { getToken } from '../lib/api';

export function ProtectedRoute() {
  const dispatch = useDispatch();
  const { user, bootstrapped } = useSelector((s) => s.auth);
  useEffect(() => { if (!bootstrapped) dispatch(fetchMe()); }, [bootstrapped, dispatch]);
  if (!bootstrapped) return <div className="grid h-screen place-items-center"><Loader2 className="animate-spin text-brand" /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestOnly() {
  const user = useSelector((s) => s.auth.user);
  return user || (getToken() && !user) ? (user ? <Navigate to="/app" replace /> : <Outlet />) : <Outlet />;
}
