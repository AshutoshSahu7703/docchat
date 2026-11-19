import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { closeSources } from '../features/ui/uiSlice';

export default function SourcesModal() {
  const dispatch = useDispatch();
  const p = useSelector((s) => s.ui.sourcesPanel);
  if (!p) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => dispatch(closeSources())}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-surface p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Sources</h2><button onClick={() => dispatch(closeSources())} aria-label="Close"><X /></button></div>
        <div className="space-y-4">
          {p.sources.map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 ${i === p.index ? 'border-brand' : 'border-line'}`}>
              <p className="text-sm font-semibold"><span className="mark px-1">{i + 1}</span> {s.docName} <span className="font-normal text-ink/50">· page {s.page} · match {Math.round(s.score * 100)}%</span></p>
              <p className="mark mt-2 text-sm leading-relaxed">{s.snippet}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
