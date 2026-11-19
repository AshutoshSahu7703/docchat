import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div><h1 className="text-6xl font-bold">404</h1><p className="mt-2 text-ink/60">This page does not exist.</p><Link to="/" className="btn-primary mt-6">Go home</Link></div>
    </div>
  );
}
