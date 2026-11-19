import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadDoc } from '../features/docs/docsSlice';

export default function UploadZone() {
  const dispatch = useDispatch(); const ref = useRef(); const [drag, setDrag] = useState(false);
  const uploading = useSelector((s) => s.docs.uploading);

  const handle = async (files) => {
    for (const file of files) {
      const r = await dispatch(uploadDoc(file));
      r.error ? toast.error(`${file.name}: ${r.payload}`) : toast.success(`${file.name} is ready to chat`);
    }
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle([...e.dataTransfer.files]); }}
      onClick={() => ref.current.click()}
      className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${drag ? 'border-brand bg-brand/5' : 'border-line bg-surface hover:border-brand/50'}`}
    >
      <input ref={ref} type="file" hidden multiple accept=".pdf,.txt,.md" onChange={(e) => { handle([...e.target.files]); e.target.value = ''; }} />
      {uploading ? <Loader2 className="animate-spin text-brand" size={32} /> : <UploadCloud className="text-brand" size={32} />}
      <p className="mt-3 font-semibold">{uploading ? 'Reading and indexing your file…' : 'Drop files here or click to browse'}</p>
      <p className="text-sm text-ink/50">PDF, TXT or MD, up to 15 MB each</p>
    </div>
  );
}
