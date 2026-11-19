import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { toggleTheme } from '../features/ui/uiSlice';

export default function ThemeToggle({ className = '' }) {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  return (
    <button onClick={() => dispatch(toggleTheme())} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink/70 transition hover:text-brand ${className}`}>
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
