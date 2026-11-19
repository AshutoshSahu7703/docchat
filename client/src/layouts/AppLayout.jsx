import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FileText, LayoutDashboard, LogOut, Menu, MessageSquarePlus, MessagesSquare, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { logout } from '../features/auth/authSlice';
import { fetchDocs } from '../features/docs/docsSlice';
import { fetchChats, deleteChat } from '../features/chat/chatSlice';
import { toggleSidebar } from '../features/ui/uiSlice';

const link = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand/10 text-brand' : 'text-ink/70 hover:bg-mist'}`;

export default function AppLayout() {
  const dispatch = useDispatch(); const nav = useNavigate(); const { chatId } = useParams(); const loc = useLocation();
  const user = useSelector((s) => s.auth.user);
  const chats = useSelector((s) => s.chat.list);
  const open = useSelector((s) => s.ui.sidebarOpen);

  useEffect(() => { dispatch(fetchDocs()); dispatch(fetchChats()); }, [dispatch]);
  useEffect(() => { dispatch(toggleSidebar(false)); }, [loc.pathname, dispatch]);

  const remove = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    await dispatch(deleteChat(id)); toast.success('Chat deleted');
    if (chatId === id) nav('/app/chat');
  };

  return (
    <div className="flex h-dvh">
      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => dispatch(toggleSidebar(false))} />}
      <aside className={`fixed z-40 flex h-full w-72 flex-col border-r border-line bg-surface transition-transform md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4"><Logo /><button className="md:hidden" onClick={() => dispatch(toggleSidebar(false))} aria-label="Close menu"><X size={20} /></button></div>
        <nav className="space-y-1 px-3">
          <NavLink to="/app" end className={link}><LayoutDashboard size={18} />Overview</NavLink>
          <NavLink to="/app/documents" className={link}><FileText size={18} />Documents</NavLink>
        </nav>
        <div className="px-3 pt-4"><button className="btn-primary w-full" onClick={() => nav('/app/chat')}><MessageSquarePlus size={16} />New chat</button></div>
        <div className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3">
          {chats.length === 0 && <p className="px-3 py-2 text-sm text-ink/50">Your chats will show up here.</p>}
          {chats.map((c) => (
            <NavLink key={c._id} to={`/app/chat/${c._id}`} className={(p) => `group ${link(p)}`}>
              <MessagesSquare size={16} className="shrink-0" />
              <span className="flex-1 truncate">{c.title}</span>
              <button onClick={(e) => remove(e, c._id)} className="opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete chat"><Trash2 size={15} /></button>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-line p-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user?.name}</p><p className="truncate text-xs text-ink/50">{user?.email}</p></div>
          <ThemeToggle />
          <button onClick={() => { dispatch(logout()); nav('/login'); }} aria-label="Log out" className="text-ink/60 hover:text-ink"><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 md:hidden">
          <button onClick={() => dispatch(toggleSidebar(true))} aria-label="Open menu"><Menu size={22} /></button><Logo size="text-lg" /><span className="ml-auto"><ThemeToggle /></span>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto"><Outlet /></div>
      </main>
    </div>
  );
}
