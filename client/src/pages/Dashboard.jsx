import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Layers, MessagesSquare, UploadCloud, MessageSquarePlus } from 'lucide-react';

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const docs = useSelector((s) => s.docs.items);
  const chats = useSelector((s) => s.chat.list);
  const ready = docs.filter((d) => d.status === 'ready');
  const stats = [
    [FileText, 'Documents ready', ready.length, 'from-indigo-500 to-blue-500'],
    [Layers, 'Pages indexed', ready.reduce((n, d) => n + d.pages, 0), 'from-fuchsia-500 to-purple-500'],
    [MessagesSquare, 'Conversations', chats.length, 'from-emerald-500 to-teal-500'],
  ];
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e2a78] via-[#3b4bff] to-[#7c3aed] p-8 text-white">
        <div className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-3xl font-bold md:text-4xl">Hi {user?.name?.split(' ')[0]} 👋</h1>
        <p className="mt-2 max-w-lg text-white/80">{ready.length ? 'Pick up where you left off, or ask something new.' : 'Upload your first document to get started.'}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/app/chat" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2a37d9] transition hover:scale-105"><MessageSquarePlus size={16} />Start a chat</Link>
          <Link to="/app/documents" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"><UploadCloud size={16} />Upload documents</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([I, l, v, g]) => (
          <div key={l} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10">
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${g} text-white`}><I size={19} /></div>
            <p className="mt-4 font-display text-4xl font-bold">{v}</p><p className="text-sm text-ink/60">{l}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Recent chats</h2>{chats.length > 0 && <span className="text-sm text-ink/50">{chats.length} total</span>}</div>
        {chats.length === 0
          ? <div className="card p-8 text-center text-sm text-ink/60">No chats yet. Start one and your conversations will appear here.</div>
          : <div className="card divide-y divide-line">
              {chats.slice(0, 5).map((c) => (
                <Link key={c._id} to={`/app/chat/${c._id}`} className="group flex items-center justify-between p-4 transition hover:bg-mist">
                  <span className="truncate font-medium">{c.title}</span>
                  <span className="flex items-center gap-3 text-xs text-ink/50">{new Date(c.updatedAt).toLocaleDateString()}<ArrowRight size={15} className="transition group-hover:translate-x-1 group-hover:text-brand" /></span>
                </Link>
              ))}
            </div>}
      </div>
    </div>
  );
}
