import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../components/UploadZone';
import { deleteDoc } from '../features/docs/docsSlice';
import { createChat } from '../features/chat/chatSlice';

const badge = { ready: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', processing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', failed: 'bg-red-500/10 text-red-600 dark:text-red-400' };

export default function Documents() {
  const dispatch = useDispatch(); const nav = useNavigate();
  const { items, loading } = useSelector((s) => s.docs);

  const chatWith = async (id) => {
    const c = await dispatch(createChat([id])).unwrap();
    nav(`/app/chat/${c._id}`);
  };
  const remove = async (d) => {
    if (!confirm(`Delete ${d.name}? Its indexed text will be removed too.`)) return;
    await dispatch(deleteDoc(d._id)); toast.success('Document deleted');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-10">
      <h1 className="text-3xl font-bold">Documents</h1>
      <UploadZone />
      <div className="card divide-y divide-line">
        {loading && items.length === 0 && <p className="p-6 text-sm text-ink/50">Loading…</p>}
        {!loading && items.length === 0 && <p className="p-6 text-sm text-ink/50">No documents yet. Upload one above to start asking questions.</p>}
        {items.map((d) => (
          <div key={d._id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
            <FileText className="shrink-0 text-brand" />
            <div className="min-w-0 flex-1 basis-40">
              <p className="truncate font-semibold">{d.name}</p>
              <p className="text-xs text-ink/50">{d.pages} pages · {d.chunkCount} passages · {(d.size / 1024).toFixed(0)} KB</p>
              {d.error && <p className="text-xs text-red-600">{d.error}</p>}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[d.status]}`}>{d.status}</span>
            {d.status === 'ready' && <button className="btn-ghost" onClick={() => chatWith(d._id)}><MessageSquare size={15} />Chat</button>}
            <button onClick={() => remove(d)} className="text-ink/40 hover:text-red-600" aria-label={`Delete ${d.name}`}><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
