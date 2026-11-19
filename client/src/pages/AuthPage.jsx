import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileText, Loader2, Lock, Mail, User, Quote } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { login, register } from '../features/auth/authSlice';

function Field({ icon: I, children }) {
  return <div className="relative"><I size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />{children}</div>;
}

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const dispatch = useDispatch(); const nav = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const r = await dispatch((isLogin ? login : register)(f));
    if (!r.error) nav('/app');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1b2670] via-[#3b4bff] to-[#7c3aed] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <span className="relative font-display text-2xl font-bold">Doc<span className="rounded bg-white/20 px-1">Chat</span></span>
        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight">Every answer comes with the page it came from.</h2>
          <p className="mt-4 max-w-md text-white/75">Upload notes, contracts or textbooks. Ask in plain language and verify each answer in one click.</p>
          <div className="relative mt-10 max-w-sm">
            <div className="glass float rounded-2xl p-4 text-sm">
              <div className="flex items-center gap-2 text-white/80"><FileText size={15} />physics-notes.pdf</div>
              <p className="mt-3 leading-relaxed">Newton ka doosra niyam batata hai ki <span className="rounded bg-yellow-300/40 px-1 font-semibold">force = mass x acceleration</span> [1]</p>
              <span className="mt-3 inline-block rounded-md bg-white/15 px-2 py-0.5 text-xs">source 1 · page 12</span>
            </div>
            <div className="glass absolute -bottom-10 -right-6 hidden rounded-2xl p-3 text-xs xl:block"><Quote size={14} className="mb-1 text-white/60" />Exam prep ke liye best, 200 pages 5 minute mein.</div>
          </div>
        </div>
        <p className="relative text-sm text-white/60">Built with the MERN stack, RAG and Gemini.</p>
      </div>

      <div className="relative flex items-center justify-center p-6">
        <div className="hero-glow pointer-events-none absolute inset-0 lg:hidden" />
        <div className="absolute right-5 top-5"><ThemeToggle /></div>
        <form onSubmit={submit} className="fade-up card relative w-full max-w-md space-y-4 p-8 shadow-xl shadow-brand/5">
          <Link to="/"><Logo size="text-2xl" /></Link>
          <div><h1 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h1><p className="mt-1 text-sm text-ink/60">{isLogin ? 'Log in to continue to your documents.' : 'Takes less than a minute. No credit card.'}</p></div>
          {!isLogin && <Field icon={User}><input className="input pl-10" placeholder="Full name" value={f.name} onChange={set('name')} required /></Field>}
          <Field icon={Mail}><input className="input pl-10" type="email" placeholder="Email" value={f.email} onChange={set('email')} required /></Field>
          <Field icon={Lock}>
            <input className="input pl-10 pr-10" type={show ? 'text' : 'password'} placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required minLength={6} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </Field>
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          <button className="btn-primary w-full py-3" disabled={loading}>{loading && <Loader2 size={16} className="animate-spin" />}{isLogin ? 'Log in' : 'Create account'}</button>
          <p className="text-center text-sm text-ink/60">
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <Link className="font-semibold text-brand" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
