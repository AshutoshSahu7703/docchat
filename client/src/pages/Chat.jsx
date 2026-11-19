import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowUp, ChevronDown, Square, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Message from '../components/Message';
import SourcesModal from '../components/SourcesModal';
import { clearActive, createChat, openChat, sendMessage, setChatDocs, stopStreaming } from '../features/chat/chatSlice';

const SUGGESTIONS = ['Summarize this document in 5 points', 'What are the key dates or deadlines?', 'Explain the main idea in simple Hinglish'];

export default function Chat() {
  const { chatId } = useParams(); const nav = useNavigate(); const dispatch = useDispatch();
  const { active, streaming, streamText, error, loading } = useSelector((s) => s.chat);
  const docs = useSelector((s) => s.docs.items).filter((d) => d.status === 'ready');
  const [text, setText] = useState(''); const [picked, setPicked] = useState([]); const [pickerOpen, setPickerOpen] = useState(false);
  const bottom = useRef();

  useEffect(() => {
    if (!chatId) { dispatch(clearActive()); return; }
    if (active?._id !== chatId) dispatch(openChat(chatId));
  }, [chatId]); // eslint-disable-line
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [active?.messages?.length, streamText]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const selected = active ? active.docIds : picked;
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    active ? dispatch(setChatDocs({ id: active._id, docIds: next })) : setPicked(next);
  };

  const send = async (q) => {
    const content = (q ?? text).trim();
    if (!content || streaming) return;
    setText('');
    try {
      let id = chatId;
      if (!id) { const c = await dispatch(createChat(picked)).unwrap(); id = c._id; nav(`/app/chat/${id}`, { replace: true }); }
      dispatch(sendMessage({ chatId: id, content }));
    } catch (e) { toast.error(String(e)); }
  };

  const messages = active?.messages || [];
  const label = selected.length ? `${selected.length} document${selected.length > 1 ? 's' : ''} selected` : `All documents (${docs.length})`;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:px-8">
        <h1 className="truncate text-lg font-bold">{active?.title || 'New chat'}</h1>
        <button className="btn-ghost" onClick={() => setPickerOpen(!pickerOpen)}>{label}<ChevronDown size={16} /></button>
        {pickerOpen && (
          <div className="absolute right-4 top-14 z-20 max-h-72 w-72 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl">
            {docs.length === 0 && <p className="p-3 text-sm text-ink/50">No ready documents yet.</p>}
            {docs.map((d) => (
              <label key={d._id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm hover:bg-mist">
                <input type="checkbox" checked={selected.includes(d._id)} onChange={() => toggle(d._id)} /><span className="truncate">{d.name}</span>
              </label>
            ))}
            <p className="px-2 pt-1 text-xs text-ink/50">Nothing selected means all documents are searched.</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {loading && <Loader2 className="mx-auto animate-spin text-brand" />}
          {!loading && messages.length === 0 && !streaming && (
            <div className="py-16 text-center">
              <h2 className="text-3xl font-bold">{docs.length ? 'What do you want to know?' : 'Add a document first'}</h2>
              <p className="mx-auto mt-2 max-w-md text-ink/60">{docs.length ? 'Answers are drawn only from your documents, with page references.' : 'Upload a PDF from the Documents page, then come back to ask questions.'}</p>
              {docs.length > 0 && <div className="mt-6 flex flex-wrap justify-center gap-2">{SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="btn-ghost">{s}</button>)}</div>}
            </div>
          )}
          {messages.map((m) => <Message key={m._id} m={m} />)}
          {streaming && (streamText ? <Message m={{ role: 'assistant', content: streamText }} streaming /> : <p className="text-sm text-ink/50">Searching your documents…</p>)}
          <div ref={bottom} />
        </div>
      </div>

      <div className="border-t border-line bg-surface p-4">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask something about your documents"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="input max-h-40 resize-none"
          />
          {streaming
            ? <button type="button" className="btn-ghost h-10 w-10 p-0!" onClick={stopStreaming} aria-label="Stop"><Square size={16} /></button>
            : <button className="btn-primary h-10 w-10 p-0!" disabled={!text.trim()} aria-label="Send"><ArrowUp size={18} /></button>}
        </form>
      </div>
      <SourcesModal />
    </div>
  );
}
