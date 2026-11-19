import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, FileSearch, Lock, Upload, Sparkles, MessageSquare, Zap, Layers } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  [FileSearch, 'Answers you can verify', 'Every reply lists the passages used, with document name, page and match score.'],
  [Zap, 'Streams as it thinks', 'Text appears live, token by token. Stop a long answer whenever you want.'],
  [Layers, 'Multi-document search', 'Pick one PDF or search across all of them in a single question.'],
  [Lock, 'Private by design', 'Every chunk is tied to your account, so nobody else can search your files.'],
];
const steps = [[Upload, 'Upload', 'Drop in a PDF, TXT or MD file. It is split into passages and indexed.'], [MessageSquare, 'Ask', 'Ask in English or Hinglish, as if you are talking to a teacher.'], [Sparkles, 'Verify', 'Open the highlighted source to see exactly where the answer came from.']];

export default function Landing() {
  const user = useSelector((s) => s.auth.user);
  const cta = user ? '/app' : '/register';
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[720px]" />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo size="text-2xl" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? <Link to="/app" className="btn-primary">Open app</Link> : <><Link to="/login" className="btn-ghost">Log in</Link><Link to="/register" className="btn-primary hidden sm:inline-flex">Get started</Link></>}
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-14 md:grid-cols-2 md:pt-20">
        <div className="fade-up">
          <h1 className="text-5xl font-bold leading-[1.04] md:text-6xl">Ask your documents. <span className="gradient-text">Get the page number</span> with the answer.</h1>
          <p className="mt-6 max-w-lg text-lg text-ink/70">Upload PDFs, ask in English or Hinglish, and check every answer against the exact passage it was taken from.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={cta} className="btn-primary px-6 py-3 text-base">Upload your first PDF <ArrowRight size={18} /></Link>
            <a href="#how" className="btn-ghost px-6 py-3 text-base">See how it works</a>
          </div>
          <p className="mt-5 text-sm text-ink/50">Free to try. No credit card.</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-brand/25 to-purple-500/20 blur-3xl" />
          <div className="card float relative space-y-4 p-6 shadow-2xl shadow-brand/10">
            <div className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-amber-400" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="ml-3 text-xs text-ink/50">employment-contract.pdf</span></div>
            <div className="fade-up ml-auto max-w-xs rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-sm text-white" style={{ animationDelay: '.4s' }}>Notice period kitna hai contract mein?</div>
            <div className="fade-up max-w-md rounded-2xl rounded-bl-sm bg-mist px-4 py-3 text-sm leading-relaxed" style={{ animationDelay: '1.1s' }}>
              Contract ke hisaab se <span className="mark font-semibold">notice period 60 din</span> ka hai, aur dono parties likhit notice de sakti hain [1].
              <div className="fade-up mt-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-xs" style={{ animationDelay: '1.8s' }}><span className="mark px-1 font-bold">1</span>employment-contract.pdf <span className="text-ink/50">p.4</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="relative mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">From PDF to answers in three steps</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([I, t, d], i) => (
            <div key={t} className="card relative p-6 transition hover:-translate-y-1 hover:border-brand/50">
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-ink/[0.06]">{i + 1}</span>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><I size={22} /></div>
              <h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-1 text-sm text-ink/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([I, t, d]) => (
            <div key={t} className="card p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"><I className="text-brand" /><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-ink/70">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e2a78] via-[#3b4bff] to-[#7c3aed] px-8 py-14 text-center text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl font-bold md:text-4xl">Stop scrolling through 200 pages.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">Upload once, ask anything, and trust the answer because you can see the source.</p>
          <Link to={cta} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#2a37d9] transition hover:scale-105">Get started free <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="relative border-t border-line py-8 text-center text-sm text-ink/50">Built with React, Redux, Node, MongoDB and Gemini.</footer>
    </div>
  );
}
