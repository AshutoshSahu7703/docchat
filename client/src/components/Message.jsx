import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { openSources } from '../features/ui/uiSlice';

export default function Message({ m, streaming }) {
  const dispatch = useDispatch();
  if (m.role === 'user') return <div className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-white md:max-w-xl">{m.content}</div>;
  return (
    <div className="max-w-[95%] md:max-w-2xl">
      <div className={`md rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-2 ${streaming ? 'caret' : ''}`}><ReactMarkdown>{m.content}</ReactMarkdown></div>
      {m.sources?.length > 0 && !streaming && (
        <div className="mt-2 flex flex-wrap gap-2">
          {m.sources.map((s, i) => (
            <button key={i} onClick={() => dispatch(openSources({ sources: m.sources, index: i }))} className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-xs hover:border-brand">
              <span className="mark px-1 font-bold">{i + 1}</span><span className="max-w-40 truncate">{s.docName}</span><span className="text-ink/50">p.{s.page}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
